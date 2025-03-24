import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import { MagazinePost } from "../../hooks/useMagazine";

interface MagazinePostDetailProps {
  post: MagazinePost;
  comments: any[];
  commentsLoading: boolean;
  onAddComment: (
    content: string,
  ) => Promise<{ success: boolean; error?: string }>;
  isLiked: boolean;
  onLike: () => void;
  onShare?: () => void;
}

const MagazinePostDetail = ({
  post,
  comments,
  commentsLoading,
  onAddComment,
  isLiked,
  onLike,
  onShare = () => {},
}: MagazinePostDetailProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Back Button */}
      <div className="p-4 border-b border-gray-200">
        <Link
          to="/magazine"
          className="inline-flex items-center text-gray-600 hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Magazine
        </Link>
      </div>

      {/* Post Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.authorAvatar} alt={post.author} />
              <AvatarFallback className="bg-red-100 text-red-800">
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        {post.contentType === "image" && post.image && (
          <div className="mb-6">
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-[600px] object-contain rounded-lg"
            />
          </div>
        )}

        {post.contentType === "video" && post.image && (
          <div className="mb-6">
            <video
              src={post.image}
              controls
              className="w-full max-h-[600px] rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {post.contentType === "audio" && post.image && (
          <div className="mb-6">
            <audio src={post.image} controls className="w-full">
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}

        {post.content && (
          <div className="prose max-w-none text-gray-700">
            <p>{post.content}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center mt-8 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${isLiked ? "text-red-600" : "text-gray-600"}`}
            onClick={onLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{post.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600 ml-2"
            onClick={() =>
              document
                .getElementById("comments")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600 ml-2"
            onClick={onShare}
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments" className="p-6 bg-gray-50 border-t border-gray-200">
        <CommentSection
          comments={comments}
          loading={commentsLoading}
          onAddComment={onAddComment}
        />
      </div>
    </div>
  );
};

export default MagazinePostDetail;
