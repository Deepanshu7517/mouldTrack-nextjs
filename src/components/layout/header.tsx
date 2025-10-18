
"use client";

import { Bell, CircleUser, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const getTitleFromPathname = (path: string) => {
    const segment = path.split("/").pop();
    if (!segment || segment === "app") return "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Button
        size="icon"
        variant="outline"
        className="sm:hidden"
        onClick={toggleSidebar}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="w-full flex-1">
        <h1 className="font-headline text-xl font-semibold md:text-2xl">{getTitleFromPathname(pathname)}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              {userAvatar ? (
                 <Image
                    src={userAvatar.imageUrl}
                    width={40}
                    height={40}
                    alt="User Avatar"
                    data-ai-hint={userAvatar.imageHint}
                    className="object-cover"
                />
              ) : (
                <CircleUser className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
