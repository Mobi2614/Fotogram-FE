"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Star, Video } from "lucide-react";
import AvatarUploadDialog from "./avatar-upload-dialog";
import EditProfileDialog from "./edit-profile-dialog";
import CreateVideoDialog from "./create-video-dialog";
import { useUser } from "@/contexts/user-context";
import { Skeleton } from "../ui/skeleton";

export default function UserInfo() {
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isCreateVideoDialogOpen, setIsCreateVideoDialogOpen] = useState(false);
  const { user, loading } = useUser();

  return (
    <div className="text-center mb-8">
      <div className="relative inline-block mb-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://github.com/shadcn.png" alt={user?.email} />
          <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="outline"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => setIsAvatarDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-1">{`${user?.firstName || ""} ${
        user?.lastName || ""
      }`}</h1>
      <p className="text-gray-600 mb-2">{user?.email || ""}</p>
      {user?.role === "creator" && (
        <Badge variant="secondary" className="mb-2">
          <Star className="h-3 w-3 mr-1" />
          Creator Account
        </Badge>
      )}
      {loading ? (
        <div className="flex justify-center">
          <Skeleton className="inline-block h-8 w-24 mx-auto" />
        </div>
      ) : (
        <div className="flex justify-center space-x-2">
          <Button variant="outline" onClick={() => setIsEditProfileDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          {user?.role === "creator" && (
            <Button variant="default" onClick={() => setIsCreateVideoDialogOpen(true)}>
              <Video className="mr-2 h-4 w-4" /> Upload Photos
            </Button>
          )}
        </div>
      )}
      <AvatarUploadDialog
        isOpen={isAvatarDialogOpen}
        onClose={() => setIsAvatarDialogOpen(false)}
      />
      <EditProfileDialog
        isOpen={isEditProfileDialogOpen}
        onClose={() => setIsEditProfileDialogOpen(false)}
      />
      <CreateVideoDialog
        isOpen={isCreateVideoDialogOpen}
        onClose={() => setIsCreateVideoDialogOpen(false)}
      />
    </div>
  );
}
