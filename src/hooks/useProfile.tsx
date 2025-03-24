import { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from "../lib/supabase";
import { useAuth } from "./useAuth";

export type UserProfile = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await getUserProfile();

        if (error) throw error;

        if (data) {
          setProfile({
            id: data.id,
            name: data.name,
            avatarUrl: data.avatar_url,
            bio: data.bio,
          });
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async ({
    name,
    bio,
  }: {
    name?: string;
    bio?: string;
  }) => {
    if (!user) {
      setError("You must be logged in to update your profile");
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await updateUserProfile({
        name,
        bio,
      });

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          avatarUrl: data.avatar_url,
          bio: data.bio,
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    if (!user) {
      setError("You must be logged in to update your avatar");
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error, publicUrl } = await uploadAvatar(file);

      if (error) throw error;

      if (data) {
        setProfile((prev) => (prev ? { ...prev, avatarUrl: publicUrl } : null));
      }

      return { success: true, avatarUrl: publicUrl };
    } catch (err: any) {
      console.error("Error updating avatar:", err);
      setError(err.message || "Failed to update avatar");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateAvatar,
  };
}
