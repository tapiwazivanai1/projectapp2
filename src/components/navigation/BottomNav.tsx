import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Heart, PlusSquare, User, BookOpen } from "lucide-react";

interface BottomNavProps {
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ className = "" }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Home",
      icon: <Home size={24} />,
      path: "/",
    },
    {
      name: "Projects",
      icon: <Heart size={24} />,
      path: "/projects",
    },
    {
      name: "Contribute",
      icon: <PlusSquare size={24} />,
      path: "/contribute",
    },
    {
      name: "Magazine",
      icon: <BookOpen size={24} />,
      path: "/magazine",
    },
    {
      name: "Profile",
      icon: <User size={24} />,
      path: "/profile",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-50",
        className,
      )}
    >
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive
                ? "text-red-600 font-medium"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <div className="relative">
              {isActive && (
                <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
              )}
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
