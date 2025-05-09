"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarUploadDialog({ isOpen, onClose }: AvatarUploadDialogProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleSave = () => {
    setUploadedImageUrl("/url");
    console.log("Saving new avatar:", uploadedImageUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4"></div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!uploadedImageUrl}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
