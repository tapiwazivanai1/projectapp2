import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "../auth/AuthModal";

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  date: string;
}

interface CommentSectionProps {
  comments: Comment[];
  loading: boolean;
  onAddComment: (
    content: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

const CommentSection = ({
  comments,
  loading,
  onAddComment,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await onAddComment(newComment);

      if (!result.success) {
        throw new Error(result.error || "Failed to add comment");
      }

      // Clear the input on success
      setNewComment("");
    } catch (err: any) {
      console.error("Error adding comment:", err);
      setError(err.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Comments</h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Post Comment
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 mb-3">Sign in to join the conversation</p>
          <AuthModal
            trigger={
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Sign In / Create Account
              </Button>
            }
          />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex space-x-3 p-3 bg-white rounded-lg border border-gray-100"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                <AvatarFallback className="bg-red-100 text-red-800">
                  {comment.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {comment.author}
                    </p>
                    <p className="text-xs text-gray-500">{comment.date}</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
