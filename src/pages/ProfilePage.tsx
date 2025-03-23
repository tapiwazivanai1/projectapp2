import React from "react";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, BookOpen, History, Settings, LogOut } from "lucide-react";

const ProfilePage: React.FC = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    joinDate: "January 2022",
    contributions: [
      {
        id: "c1",
        project: "Church Building Renovation",
        amount: 150,
        date: "2023-05-15",
      },
      {
        id: "c2",
        project: "Youth Camp Sponsorship",
        amount: 75,
        date: "2023-07-22",
      },
      {
        id: "c3",
        project: "Community Outreach Program",
        amount: 100,
        date: "2023-09-10",
      },
    ],
    magazineSubmissions: [
      {
        id: "m1",
        title: "Finding Peace in Prayer",
        status: "approved",
        date: "2023-06-05",
      },
      {
        id: "m2",
        title: "My Mission Trip Experience",
        status: "pending",
        date: "2023-08-18",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-red-100 text-red-800 text-xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {user.joinDate}
              </p>

              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" /> Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="contributions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="contributions"
              className="flex items-center gap-1"
            >
              <Heart className="h-4 w-4" /> Contributions
            </TabsTrigger>
            <TabsTrigger value="magazine" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Magazine
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <History className="h-4 w-4" /> Activity
            </TabsTrigger>
          </TabsList>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Contributions
                </h2>
              </div>

              {user.contributions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {user.contributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {contribution.project}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(contribution.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${contribution.amount}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-red-600 p-0 h-auto"
                        >
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">
                    You haven't made any contributions yet.
                  </p>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                    Explore Projects
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Magazine Tab */}
          <TabsContent value="magazine" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Magazine Submissions
                </h2>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  New Submission
                </Button>
              </div>

              {user.magazineSubmissions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {user.magazineSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {submission.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(submission.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${submission.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {submission.status === "approved"
                            ? "Approved"
                            : "Pending"}
                        </span>
                        <div className="mt-1">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-red-600 p-0 h-auto"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">
                    You haven't submitted any magazine content yet.
                  </p>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                    Contribute to Magazine
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                Your recent activity will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
