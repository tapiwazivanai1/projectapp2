import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProjectCard from "./ProjectCard";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  currentAmount: number;
  goalAmount: number;
  deadline: string;
}

interface ProjectGridProps {
  projects?: Project[];
  categories?: string[];
  onProjectClick?: (projectId: string) => void;
}

const ProjectGrid = ({
  projects = [
    {
      id: "project-1",
      title: "Church Building Renovation",
      description:
        "Help us renovate the main sanctuary to accommodate our growing congregation and improve facilities.",
      image:
        "https://images.unsplash.com/photo-1543674892-7d64d45df18d?w=600&q=80",
      category: "Construction",
      currentAmount: 15000,
      goalAmount: 50000,
      deadline: "2023-12-31",
    },
    {
      id: "project-2",
      title: "Youth Camp Sponsorship",
      description:
        "Support our annual youth camp by sponsoring children who cannot afford to attend this life-changing event.",
      image:
        "https://images.unsplash.com/photo-1516402707257-787c50fc3898?w=600&q=80",
      category: "Youth",
      currentAmount: 5000,
      goalAmount: 12000,
      deadline: "2023-08-15",
    },
    {
      id: "project-3",
      title: "Community Outreach Program",
      description:
        "Fund our monthly outreach program providing food, clothing, and essential supplies to vulnerable communities.",
      image:
        "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&q=80",
      category: "Outreach",
      currentAmount: 8500,
      goalAmount: 10000,
      deadline: "2023-10-01",
    },
    {
      id: "project-4",
      title: "Musical Instruments Fund",
      description:
        "Help us purchase new musical instruments for our worship team to enhance our Sunday service experience.",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80",
      category: "Worship",
      currentAmount: 3000,
      goalAmount: 7500,
      deadline: "2023-11-30",
    },
    {
      id: "project-5",
      title: "Children's Ministry Resources",
      description:
        "Support our children's ministry by helping us purchase educational materials and resources for Sunday School.",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
      category: "Children",
      currentAmount: 1200,
      goalAmount: 3000,
      deadline: "2023-09-15",
    },
    {
      id: "project-6",
      title: "International Missions Trip",
      description:
        "Support our team of missionaries traveling to provide aid, share the gospel, and build relationships abroad.",
      image:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
      category: "Missions",
      currentAmount: 12000,
      goalAmount: 25000,
      deadline: "2024-02-28",
    },
  ],
  categories = [
    "All",
    "Construction",
    "Youth",
    "Outreach",
    "Worship",
    "Children",
    "Missions",
  ],
  onProjectClick = (projectId: string) =>
    console.log(`Project clicked: ${projectId}`),
}: ProjectGridProps) => {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="w-full bg-gray-50 p-4 md:p-6 rounded-lg">
      <Tabs defaultValue="All" className="w-full">
        <div className="mb-6 overflow-x-auto">
          <TabsList className="bg-white border border-gray-200 p-1 w-full md:w-auto inline-flex">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  "data-[state=active]:bg-red-600 data-[state=active]:text-white",
                  "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700",
                )}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            {category === activeCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="flex justify-center">
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        category={project.category}
                        currentAmount={project.currentAmount}
                        goalAmount={project.goalAmount}
                        deadline={project.deadline}
                        onClick={() => onProjectClick(project.id)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex justify-center items-center h-40 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-center">
                      No projects found in this category. Check back soon for
                      new opportunities to contribute!
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProjectGrid;
