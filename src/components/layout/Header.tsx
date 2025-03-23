import React from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const Header = ({
  userName = "John Doe",
  userAvatar = "",
  notificationCount = 3,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Guta Ra Mwari</SheetTitle>
              <SheetDescription>
                Fundraising & Community Engagement
              </SheetDescription>
            </SheetHeader>
            <nav className="mt-6 flex flex-col space-y-4">
              <Link
                to="/"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Projects
              </Link>
              <Link
                to="/community"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Community
              </Link>
              <Link
                to="/magazine"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Magazine
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
            <span className="text-lg font-bold">GRM</span>
          </div>
          <span className="ml-2 hidden text-xl font-bold text-red-600 md:block">
            Guta Ra Mwari
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            Home
          </Link>
          <Link
            to="/projects"
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            Projects
          </Link>
          <Link
            to="/community"
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            Community
          </Link>
          <Link
            to="/magazine"
            className="text-sm font-medium text-gray-700 hover:text-red-600"
          >
            Magazine
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      userAvatar ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    }
                    alt={userName}
                  />
                  <AvatarFallback className="bg-red-100 text-red-800">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex w-full items-center">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/contributions" className="flex w-full items-center">
                  My Contributions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex w-full items-center">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
