import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  currentAmount?: number;
  goalAmount?: number;
  deadline?: string;
  onClick?: () => void;
}

const ProjectCard = ({
  id = "project-1",
  title = "Church Building Renovation",
  description = "Help us renovate the main sanctuary to accommodate our growing congregation and improve facilities.",
  image = "https://images.unsplash.com/photo-1543674892-7d64d45df18d?w=600&q=80",
  category = "Construction",
  currentAmount = 15000,
  goalAmount = 50000,
  deadline = "2023-12-31",
  onClick = () => console.log("Project card clicked"),
}: ProjectCardProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((currentAmount / goalAmount) * 100),
    100,
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format deadline
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card
      className={cn(
        "w-full max-w-[320px] overflow-hidden transition-all duration-300 hover:shadow-lg bg-white",
        "border-2 border-gray-100 hover:border-red-100",
      )}
      onClick={onClick}
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold py-1 px-2 rounded-full">
          {category}
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">
              {formatCurrency(currentAmount)}
            </span>
            <span className="text-gray-500">
              of {formatCurrency(goalAmount)}
            </span>
          </div>

          <Progress
            value={progressPercentage}
            className="h-2 bg-gray-200"
            indicatorClassName={cn(
              progressPercentage < 30
                ? "bg-red-500"
                : progressPercentage < 70
                  ? "bg-amber-500"
                  : "bg-green-600",
            )}
          />

          <div className="flex justify-between text-xs">
            <span className="text-gray-500">{progressPercentage}% Funded</span>
            <span className="text-gray-500">
              Ends {formatDeadline(deadline)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          size="sm"
        >
          Donate Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
