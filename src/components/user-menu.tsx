"use client";

import { Button } from "./ui/button";
import AuthDialog from "./auth/auth-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, LogOut } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { loading, isLoggedIn, user: userData, logout } = useUser();
  const router = useRouter();
  const user = {
    ...userData,
    avatarUrl: "https://github.com/shadcn.png",
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-20 " />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthDialog />;
  }

  if (user)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative ">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user?.firstName} />
              <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">{user?.firstName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/profile"}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
