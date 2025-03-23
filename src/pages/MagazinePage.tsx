import React, { useState, useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { PlusSquare, Heart, MessageCircle, Share2, Filter } from "lucide-react";
import { Link } from "react-router-dom";

interface MagazinePost {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  height: number; // For masonry layout
}

const MagazinePage: React.FC = () => {
  const [posts, setPosts] = useState<MagazinePost[]>([
    {
      id: "post1",
      title: "Finding Faith in Difficult Times",
      content:
        "A personal testimony about finding strength through prayer and community support.",
      image:
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80",
      author: "Sarah M.",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      date: "2 days ago",
      likes: 24,
      comments: 5,
      height: 250,
    },
    {
      id: "post2",
      title: "Youth Camp Highlights",
      content:
        "Photos and stories from our recent youth retreat in the mountains.",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?w=600&q=80",
      author: "David K.",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      date: "5 days ago",
      likes: 42,
      comments: 12,
      height: 320,
    },
    {
      id: "post3",
      title: "Sunday Service Reflection",
      content:
        "Key takeaways from last Sunday's powerful sermon on community and fellowship.",
      image:
        "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&q=80",
      author: "Pastor James",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      date: "1 week ago",
      likes: 87,
      comments: 23,
      height: 280,
    },
    {
      id: "post4",
      title: "Community Outreach Success",
      content:
        "Our recent food drive helped over 200 families in need. See the impact we made together.",
      image:
        "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&q=80",
      author: "Mercy T.",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mercy",
      date: "2 weeks ago",
      likes: 56,
      comments: 8,
      height: 300,
    },
    {
      id: "post5",
      title: "Worship Team Behind the Scenes",
      content: "A look at how our worship team prepares for Sunday services.",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80",
      author: "Michael R.",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      date: "2 weeks ago",
      likes: 34,
      comments: 6,
      height: 260,
    },
    {
      id: "post6",
      title: "Children's Ministry Update",
      content:
        "New curriculum and activities for our growing children's ministry.",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
      author: "Grace L.",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
      date: "3 weeks ago",
      likes: 29,
      comments: 4,
      height: 290,
    },
    {
      id: "post7",
      title: "Bible Study Insights: Book of James",
      content:
        "Key lessons from our ongoing Bible study series on the Book of James.",
      image:
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80",
      author: "Elder Thomas",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      date: "3 weeks ago",
      likes: 45,
      comments: 15,
      height: 270,
    },
    {
      id: "post8",
      title: "Church Anniversary Celebration",
      content:
        "Photos from our 25th anniversary celebration and testimonies from founding members.",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
      author: "Ruth N.",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruth",
      date: "1 month ago",
      likes: 78,
      comments: 32,
      height: 310,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Simulate infinite scroll
  const loadMorePosts = () => {
    if (loading) return;

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // Clone and modify some existing posts to simulate new content
      const newPosts = posts.slice(0, 4).map((post) => ({
        ...post,
        id: `post-new-${Math.random().toString(36).substr(2, 9)}`,
        date: "Just now",
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        height: Math.floor(Math.random() * 100) + 250, // Random height for variety
      }));

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 1500);
  };

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entities) => {
      const target = entities[0];
      if (target.isIntersecting && !loading && page < 5) {
        // Limit to 5 pages for demo
        loadMorePosts();
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading, page]);

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes - 1 } : post,
          ),
        );
      } else {
        newLiked.add(postId);
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        );
      }
      return newLiked;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Magazine Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Guta Ra Mwari Magazine
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Link to="/magazine/contribute">
              <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1">
                <PlusSquare className="h-4 w-4" /> Contribute
              </Button>
            </Link>
          </div>
        </div>

        {/* Pinterest-style Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="break-inside-avoid bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
              style={{ marginBottom: "1rem" }}
            >
              {/* Post Image */}
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover hover:scale-105 transition-transform duration-300"
                  style={{ height: `${post.height}px` }}
                />
              </div>

              {/* Post Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-700 text-sm mb-3">{post.content}</p>

                {/* Author Info */}
                <div className="flex items-center mb-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.author}
                    </p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 ${likedPosts.has(post.id) ? "text-red-600" : "text-gray-600"}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`}
                    />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-600"
                  >
                    <MessageCircle className="h-4 w-4" /> {post.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-600"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={loader} className="flex justify-center items-center py-8">
          {loading && (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-2"></div>
              <p className="text-gray-600">Loading more content...</p>
            </div>
          )}
          {!loading && page >= 5 && (
            <p className="text-gray-600">You've reached the end of the feed!</p>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MagazinePage;
