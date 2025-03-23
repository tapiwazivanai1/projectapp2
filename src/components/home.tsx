import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import FeaturedProject from "./projects/FeaturedProject";
import ProjectGrid from "./projects/ProjectGrid";
import BottomNav from "./navigation/BottomNav";

function Home() {
  const navigate = useNavigate();

  // Uncomment this to automatically redirect to magazine page
  // useEffect(() => {
  //   navigate("/magazine");
  // }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Banner */}
        <div className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome to Guta Ra Mwari
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community in supporting church projects and engaging with
            our featured magazine content.
          </p>
        </div>

        {/* Featured Project (Magazine) */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Featured Project
          </h2>
          <FeaturedProject />
        </section>

        {/* Other Projects */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Other Projects
          </h2>
          <ProjectGrid />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

export default Home;
