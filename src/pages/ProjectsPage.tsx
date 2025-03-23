import React from "react";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import ProjectGrid from "../components/projects/ProjectGrid";

const ProjectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Fundraising Projects
        </h1>
        <ProjectGrid />
      </main>

      <BottomNav />
    </div>
  );
};

export default ProjectsPage;
