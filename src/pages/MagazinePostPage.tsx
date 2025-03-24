import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import MagazinePostDetail from "../components/magazine/MagazinePostDetail";
import { useMagazinePost } from "../hooks/useMagazine";
import { useAuth } from "../hooks/useAuth";

const MagazinePostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { post, loading, error, comments, commentsLoading, addComment } =
    useMagazinePost(postId || "");

  // Handle like functionality
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLike = () => {
    if (!user) {
      // Redirect to login or show auth modal
      return;
    }

    // Toggle like state for immediate feedback
    setIsLiked(!isLiked);

    // Here you would call your API to like/unlike the post
    // This would be implemented in the useMagazinePost hook
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator
        .share({
          title: post.title,
          text: post.content?.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // If post not found or error
  useEffect(() => {
    if (!loading && (error || !post)) {
      navigate("/magazine", { replace: true });
    }
  }, [loading, error, post, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <main className="container mx-auto px-4 py-12 flex justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!post) return null; // This will redirect due to the useEffect

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <MagazinePostDetail
          post={post}
          comments={comments}
          commentsLoading={commentsLoading}
          onAddComment={addComment}
          isLiked={isLiked}
          onLike={handleLike}
          onShare={handleShare}
        />
      </main>

      <BottomNav />
    </div>
  );
};

export default MagazinePostPage;
