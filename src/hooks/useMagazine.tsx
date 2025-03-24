import { useState, useEffect } from "react";
import {
  getMagazinePosts,
  getMagazinePostById,
  createMagazinePost,
  uploadMagazineFile,
  getUserMagazineSubmissions,
  likeMagazinePost,
  getUserLikedPosts,
  addMagazineComment,
  getMagazineComments,
} from "../lib/supabase";
import { useAuth } from "./useAuth";

export type MagazinePost = {
  id: string;
  title: string;
  content?: string;
  image?: string;
  author: string;
  authorAvatar?: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
  contentType: "article" | "image" | "video" | "audio";
  status: "pending" | "approved" | "rejected";
};

export function useMagazinePosts(initialPage = 1) {
  const [posts, setPosts] = useState<MagazinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const { user } = useAuth();

  // Fetch liked posts for the current user
  useEffect(() => {
    if (user) {
      const fetchLikedPosts = async () => {
        try {
          const { data, error } = await getUserLikedPosts();
          if (error) throw error;
          setLikedPostIds(data || []);
        } catch (err) {
          console.error("Error fetching liked posts:", err);
        }
      };

      fetchLikedPosts();
    }
  }, [user]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error, count } = await getMagazinePosts(page);

        if (error) throw error;

        // Transform data to match our MagazinePost type
        const formattedPosts =
          data?.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content || undefined,
            image:
              post.content_type === "image" && post.file_path
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/magazine_content/${post.file_path}`
                : undefined,
            author: post.profiles?.name || "Anonymous",
            authorAvatar: post.profiles?.avatar_url || undefined,
            date: new Date(post.created_at).toLocaleDateString(),
            likes: post.likes_count,
            comments: post.comments_count,
            category: post.category,
            contentType: post.content_type as any,
            status: post.status as any,
          })) || [];

        if (page === 1) {
          setPosts(formattedPosts);
        } else {
          setPosts((prev) => [...prev, ...formattedPosts]);
        }

        // Check if there are more posts to load
        setHasMore(count ? page * 8 < count : false);
      } catch (err: any) {
        console.error("Error fetching magazine posts:", err);
        setError(err.message || "Failed to load magazine posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const { data, error } = await likeMagazinePost(postId);
      if (error) throw error;

      // Update local state
      if (data.liked) {
        setLikedPostIds((prev) => [...prev, postId]);
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        );
      } else {
        setLikedPostIds((prev) => prev.filter((id) => id !== postId));
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: post.likes - 1 } : post,
          ),
        );
      }
    } catch (err: any) {
      console.error("Error liking post:", err);
    }
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    likedPostIds,
    handleLike,
  };
}

export function useMagazinePost(postId: string) {
  const [post, setPost] = useState<MagazinePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await getMagazinePostById(postId);

        if (error) throw error;
        if (!data) throw new Error("Post not found");

        // Transform data to match our MagazinePost type
        setPost({
          id: data.id,
          title: data.title,
          content: data.content || undefined,
          image:
            data.content_type === "image" && data.file_path
              ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/magazine_content/${data.file_path}`
              : undefined,
          author: data.profiles?.name || "Anonymous",
          authorAvatar: data.profiles?.avatar_url || undefined,
          date: new Date(data.created_at).toLocaleDateString(),
          likes: data.likes_count,
          comments: data.comments_count,
          category: data.category,
          contentType: data.content_type as any,
          status: data.status as any,
        });

        // Fetch comments
        fetchComments();
      } catch (err: any) {
        console.error("Error fetching magazine post:", err);
        setError(err.message || "Failed to load magazine post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const { data, error } = await getMagazineComments(postId);
      if (error) throw error;

      // Format comments
      const formattedComments =
        data?.map((comment) => ({
          id: comment.id,
          content: comment.content,
          author: comment.profiles?.name || "Anonymous",
          authorAvatar: comment.profiles?.avatar_url || undefined,
          date: new Date(comment.created_at).toLocaleDateString(),
        })) || [];

      setComments(formattedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await addMagazineComment(postId, content);
      if (error) throw error;

      // Update local state
      if (data && data[0]) {
        const newComment = {
          id: data[0].id,
          content: data[0].content,
          author: data[0].profiles?.name || "Anonymous",
          authorAvatar: data[0].profiles?.avatar_url || undefined,
          date: new Date(data[0].created_at).toLocaleDateString(),
        };

        setComments((prev) => [newComment, ...prev]);
        setPost((prev) =>
          prev ? { ...prev, comments: prev.comments + 1 } : null,
        );
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error adding comment:", err);
      return { success: false, error: err.message };
    }
  };

  return {
    post,
    loading,
    error,
    comments,
    commentsLoading,
    addComment,
    refreshComments: fetchComments,
  };
}

export function useSubmitMagazineContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const submitContent = async ({
    title,
    content,
    category,
    contentType,
    file,
  }: {
    title: string;
    content?: string;
    category: string;
    contentType: "article" | "image" | "video" | "audio";
    file?: File;
  }) => {
    if (!user) {
      setError("You must be logged in to submit content");
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      let filePath = null;

      // Upload file if provided
      if (file && contentType !== "article") {
        const {
          data,
          error,
          filePath: path,
        } = await uploadMagazineFile(file, contentType);
        if (error) throw error;
        filePath = path;
      }

      // Create magazine post
      const { data, error } = await createMagazinePost({
        title,
        content: contentType === "article" ? content : undefined,
        category,
        content_type: contentType,
        file_path: filePath,
      });

      if (error) throw error;

      setSuccess(true);
      return { success: true, data };
    } catch (err: any) {
      console.error("Error submitting magazine content:", err);
      setError(err.message || "Failed to submit content");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitContent,
    loading,
    error,
    success,
  };
}

export function useUserMagazineSubmissions() {
  const [submissions, setSubmissions] = useState<MagazinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await getUserMagazineSubmissions();

        if (error) throw error;

        // Transform data to match our MagazinePost type
        const formattedSubmissions =
          data?.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content || undefined,
            image:
              post.content_type === "image" && post.file_path
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/magazine_content/${post.file_path}`
                : undefined,
            author: "You",
            date: new Date(post.created_at).toLocaleDateString(),
            likes: post.likes_count,
            comments: post.comments_count,
            category: post.category,
            contentType: post.content_type as any,
            status: post.status as any,
          })) || [];

        setSubmissions(formattedSubmissions);
      } catch (err: any) {
        console.error("Error fetching user submissions:", err);
        setError(err.message || "Failed to load your submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  return {
    submissions,
    loading,
    error,
  };
}
