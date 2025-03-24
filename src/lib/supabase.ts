import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// User authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// Magazine content functions
export const getMagazinePosts = async (page = 1, limit = 8) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("magazine_posts")
    .select("*, profiles(name, avatar_url)", { count: "exact" })
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(from, to);

  return { data, error, count };
};

export const getMagazinePostById = async (postId: string) => {
  const { data, error } = await supabase
    .from("magazine_posts")
    .select("*, profiles(name, avatar_url)")
    .eq("id", postId)
    .single();

  return { data, error };
};

export const createMagazinePost = async (postData: {
  title: string;
  content?: string;
  category: string;
  content_type: "article" | "image" | "video" | "audio";
  file_path?: string;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("magazine_posts")
    .insert([
      {
        user_id: userData.user.id,
        title: postData.title,
        content: postData.content || null,
        category: postData.category,
        content_type: postData.content_type,
        file_path: postData.file_path || null,
        status: "pending", // All posts start as pending and need approval
      },
    ])
    .select();

  return { data, error };
};

export const uploadMagazineFile = async (file: File, contentType: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;
  const filePath = `magazine/${contentType}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("magazine_content")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  return { data, error, filePath };
};

export const getUserMagazineSubmissions = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("magazine_posts")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Like and comment functions
export const likeMagazinePost = async (postId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  // Check if user already liked the post
  const { data: existingLike } = await supabase
    .from("magazine_likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userData.user.id)
    .single();

  if (existingLike) {
    // Unlike the post
    const { error } = await supabase
      .from("magazine_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userData.user.id);

    if (!error) {
      // Decrement likes count
      await supabase.rpc("decrement_magazine_post_likes", { post_id: postId });
    }

    return { data: { liked: false }, error };
  } else {
    // Like the post
    const { data, error } = await supabase
      .from("magazine_likes")
      .insert([{ post_id: postId, user_id: userData.user.id }])
      .select();

    if (!error) {
      // Increment likes count
      await supabase.rpc("increment_magazine_post_likes", { post_id: postId });
    }

    return { data: { liked: true }, error };
  }
};

export const getUserLikedPosts = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("magazine_likes")
    .select("post_id")
    .eq("user_id", userData.user.id);

  return {
    data: data?.map((item) => item.post_id) || [],
    error,
  };
};

export const addMagazineComment = async (postId: string, content: string) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("magazine_comments")
    .insert([
      {
        post_id: postId,
        user_id: userData.user.id,
        content,
      },
    ])
    .select("*, profiles(name, avatar_url)");

  if (!error) {
    // Increment comments count
    await supabase.rpc("increment_magazine_post_comments", { post_id: postId });
  }

  return { data, error };
};

export const getMagazineComments = async (postId: string) => {
  const { data, error } = await supabase
    .from("magazine_comments")
    .select("*, profiles(name, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Project functions
export const getProjects = async (category?: string) => {
  let query = supabase
    .from("projects")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getFeaturedProject = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .single();

  return { data, error };
};

export const contributeToProject = async (
  projectId: string,
  amount: number,
  anonymous: boolean = false,
) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("contributions")
    .insert([
      {
        project_id: projectId,
        user_id: userData.user.id,
        amount,
        anonymous,
      },
    ])
    .select();

  if (!error) {
    // Update project's current amount
    await supabase.rpc("update_project_amount", {
      project_id: projectId,
      contribution_amount: amount,
    });
  }

  return { data, error };
};

export const getUserContributions = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("contributions")
    .select("*, projects(title)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data, error };
};

// User profile functions
export const getUserProfile = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  return { data, error };
};

export const updateUserProfile = async (profileData: {
  name?: string;
  avatar_url?: string;
  bio?: string;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userData.user.id)
    .select();

  return { data, error };
};

export const uploadAvatar = async (file: File) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: { message: "User not authenticated" } };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${userData.user.id}/${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError };
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // Update user profile with new avatar URL
  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", userData.user.id)
    .select();

  return { data, error, publicUrl: urlData.publicUrl };
};
