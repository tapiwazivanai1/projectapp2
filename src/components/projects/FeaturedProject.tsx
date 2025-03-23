import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  Clock,
  Users,
  BookOpen,
  PlusSquare,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface MagazinePost {
  id: string;
  title: string;
  image: string;
  author: string;
  date: string;
  likes: number;
}

interface FeaturedProjectProps {
  title?: string;
  description?: string;
  image?: string;
  currentAmount?: number;
  goalAmount?: number;
  progress?: number;
  deadline?: string;
  daysLeft?: number;
  contributors?: number;
  onContribute?: () => void;
  magazinePosts?: MagazinePost[];
}

const FeaturedProject = ({
  title = "Guta Ra Mwari Magazine",
  description = "Our featured project until April 2026 - a community-driven magazine showcasing testimonies, articles, and media from our congregation. Contribute your content and engage with others in our Pinterest-style feed.",
  image = "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=1200&q=80",
  currentAmount = 25000,
  goalAmount = 50000,
  progress = 50,
  deadline = "April 30, 2026",
  daysLeft = 730,
  contributors = 156,
  onContribute = () => console.log("Contribute button clicked"),
  magazinePosts = [
    {
      id: "post1",
      title: "Finding Faith in Difficult Times",
      image:
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80",
      author: "Sarah M.",
      date: "2 days ago",
      likes: 24,
    },
    {
      id: "post2",
      title: "Youth Camp Highlights",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?w=600&q=80",
      author: "David K.",
      date: "5 days ago",
      likes: 42,
    },
    {
      id: "post3",
      title: "Sunday Service Reflection",
      image:
        "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&q=80",
      author: "Pastor James",
      date: "1 week ago",
      likes: 87,
    },
    {
      id: "post4",
      title: "Community Outreach Success",
      image:
        "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&q=80",
      author: "Mercy T.",
      date: "2 weeks ago",
      likes: 56,
    },
  ],
}: FeaturedProjectProps) => {
  const [visiblePosts, setVisiblePosts] = useState(2);

  const loadMorePosts = () => {
    setVisiblePosts((prev) => Math.min(prev + 2, magazinePosts.length));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Project Image */}
        <div className="md:w-2/5 h-64 md:h-auto">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Project Details */}
        <div className="md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Featured Until 2026
              </span>
            </div>

            <p className="text-gray-700 mb-4">{description}</p>

            {/* Progress Section */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-gray-700">
                  ${currentAmount.toLocaleString()} raised
                </span>
                <span className="text-sm text-gray-500">
                  of ${goalAmount.toLocaleString()} goal
                </span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-200" />
            </div>

            {/* Project Stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarDays className="mr-1 h-4 w-4" />
                <span>Deadline: {deadline}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="mr-1 h-4 w-4" />
                <span>{daysLeft} days left</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="mr-1 h-4 w-4" />
                <span>{contributors} contributors</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onContribute}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <BookOpen className="mr-2 h-4 w-4" /> View Magazine
            </Button>
            <Link to="/magazine/contribute" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
                size="lg"
              >
                <PlusSquare className="mr-2 h-4 w-4" /> Contribute Content
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Magazine Feed Preview */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Latest Magazine Content
          </h3>
          <Link
            to="/magazine"
            className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {magazinePosts.slice(0, visiblePosts).map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative pb-[100%] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 line-clamp-1">
                  {post.title}
                </h4>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visiblePosts < magazinePosts.length && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={loadMorePosts}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProject;
