"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Header({ header = "Dashboard" }: { header?: string }) {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800 transition-colors duration-200 hover:text-gray-900">{header}</h2>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-300 hover:bg-gray-100 hover:scale-110 hover:shadow-md"
          >
            <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-300 hover:bg-gray-100 hover:scale-110 hover:shadow-md"
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
              <DropdownMenuItem className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 cursor-pointer">
                <User className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 cursor-pointer">
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
