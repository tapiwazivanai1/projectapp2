import { useState, useEffect } from "react";
import {
  getProjects,
  getFeaturedProject,
  contributeToProject,
  getUserContributions,
} from "../lib/supabase";
import { useAuth } from "./useAuth";

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  currentAmount: number;
  goalAmount: number;
  deadline: string;
  featured: boolean;
};

export type Contribution = {
  id: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  date: string;
  anonymous: boolean;
};

export function useProjects(category?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await getProjects(category);

        if (error) throw error;

        // Transform data to match our Project type
        const formattedProjects =
          data?.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image,
            category: project.category,
            currentAmount: project.current_amount,
            goalAmount: project.goal_amount,
            deadline: project.deadline,
            featured: project.featured,
          })) || [];

        setProjects(formattedProjects);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  return {
    projects,
    loading,
    error,
  };
}

export function useFeaturedProject() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await getFeaturedProject();

        if (error) throw error;

        if (data) {
          // Transform data to match our Project type
          setProject({
            id: data.id,
            title: data.title,
            description: data.description,
            image: data.image,
            category: data.category,
            currentAmount: data.current_amount,
            goalAmount: data.goal_amount,
            deadline: data.deadline,
            featured: data.featured,
          });
        }
      } catch (err: any) {
        console.error("Error fetching featured project:", err);
        setError(err.message || "Failed to load featured project");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProject();
  }, []);

  return {
    project,
    loading,
    error,
  };
}

export function useContributeToProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const contribute = async ({
    projectId,
    amount,
    anonymous = false,
  }: {
    projectId: string;
    amount: number;
    anonymous?: boolean;
  }) => {
    if (!user) {
      setError("You must be logged in to make a contribution");
      return { success: false };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { data, error } = await contributeToProject(
        projectId,
        amount,
        anonymous,
      );

      if (error) throw error;

      setSuccess(true);
      return { success: true, data };
    } catch (err: any) {
      console.error("Error making contribution:", err);
      setError(err.message || "Failed to process contribution");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    contribute,
    loading,
    error,
    success,
  };
}

export function useUserContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setContributions([]);
      setLoading(false);
      return;
    }

    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await getUserContributions();

        if (error) throw error;

        // Transform data to match our Contribution type
        const formattedContributions =
          data?.map((contribution) => ({
            id: contribution.id,
            projectId: contribution.project_id,
            projectTitle: contribution.projects?.title || "Unknown Project",
            amount: contribution.amount,
            date: new Date(contribution.created_at).toLocaleDateString(),
            anonymous: contribution.anonymous,
          })) || [];

        setContributions(formattedContributions);
      } catch (err: any) {
        console.error("Error fetching user contributions:", err);
        setError(err.message || "Failed to load your contributions");
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [user]);

  return {
    contributions,
    loading,
    error,
  };
}
