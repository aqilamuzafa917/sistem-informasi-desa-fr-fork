"use client";

import { ChevronsUpDown, LogOut, User, AlertCircle } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export function NavUser() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { user, loading, error, logout } = useUser();

  console.log(
    "NavUser render - user:",
    user,
    "loading:",
    loading,
    "error:",
    error,
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center p-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="ml-2 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-2 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Only show error if there's an actual API error (not just no token)
  if (error && error !== "No authentication token found") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="text-red-600 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            <AlertCircle className="h-4 w-4" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Error loading user</span>
              <span className="truncate text-xs text-red-500">{error}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) {
    console.log("No user data available");
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="text-gray-500"
            onClick={() => navigate("/login")}
          >
            <User className="h-4 w-4" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Not logged in</span>
              <span className="truncate text-xs">Click to login</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                <User className="h-4 w-4" />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                  <User className="h-4 w-4" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
