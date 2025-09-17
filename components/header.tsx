"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function Header({ user, header = "Dashboard" }: { user?: any; header?: string }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or perform search
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800 transition-colors duration-200 hover:text-gray-900">{header}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="transition-all duration-300 hover:bg-gray-100 hover:scale-110 hover:shadow-md"
              >
                <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className="space-y-4">
                <Input
                  placeholder="Search products, orders, suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" className="w-full">
                  Search
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-300 hover:bg-gray-100 hover:scale-110 hover:shadow-md"
            onClick={() => router.push("/alerts")}
          >
            <Bell className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-105">
                  <AvatarImage src="" alt={user?.name || ""} />
                  <AvatarFallback className="transition-colors duration-200 hover:bg-gray-200">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleProfileClick}
                className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 cursor-pointer"
              >
                <User className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSettingsClick}
                className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="transition-all duration-200 hover:bg-red-50 hover:text-red-700 hover:scale-105 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
