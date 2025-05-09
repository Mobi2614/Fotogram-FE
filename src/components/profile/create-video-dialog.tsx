"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropzone } from "@/components/ui/dropzone";
import { CircleX, Upload, X } from "lucide-react";
import { uploadFile } from "@/services/upload-api";
import { createVideo } from "@/services/videos-api";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";
import Spinner from "../ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

type ActionStateType = {
  loading: boolean;
  error: string | null;
};

interface CreateImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
const actionState = {
  loading: false,
  error: null,
};

export default function CreateImageDialog({ isOpen, onClose }: CreateImageDialogProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [{ error, loading }, setActionState] = useState<ActionStateType>(actionState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const { fetchCurrentUser, user } = useUser();
  const queryClient = useQueryClient();

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("files", imageFile);
    try {
      setActionState({ loading: true, error: null });
      // Upload the image file
      const uploadResponse = await uploadFile(formData);
      if (!uploadResponse || !uploadResponse.data || uploadResponse.data.length === 0) {
        console.error("File upload failed");
        return;
      }

      const fileUrl = uploadResponse.data[0].url;

      // Prepare the image payload (using the same API as videos)
      const imagePayload = {
        title,
        description,
        url: fileUrl,
        tags: tags.split(",").map((tag) => tag.trim()),
        creator: user?.id as string,
        thumbnailUrl: fileUrl, // For images, the URL and thumbnailUrl are the same
      };

      // Create the image (using the same API endpoint as videos)
      await createVideo(imagePayload);
      fetchCurrentUser();
      handleCancel();
      queryClient.refetchQueries({ queryKey: ["user-videos"] });
    } catch (error) {
      setActionState({
        loading: false,
        error: error instanceof Error ? error.message : (error as string),
      });
    } finally {
      setActionState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCancel = () => {
    setImageFile(null);
    setImageUrl(null);
    setTitle("");
    setDescription("");
    setTags("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className={cn(imageFile ? "sm:max-w-3xl" : "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle>Create New Image</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {error && (
            <div className="px-4 py-2 bg-destructive text-foreground rounded-md flex gap-2 items-center">
              <CircleX />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}
        </DialogDescription>
        <div className="flex gap-6">
          <div className={cn("flex-1", imageFile ? "max-w-80" : "")}>
            {imageUrl ? (
              <div className="relative border border-muted rounded-lg">
                <div className="relative w-full h-[350px]">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Dropzone onDrop={handleFileDrop} accept={{ "image/*": [] }} maxFiles={1}>
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image file here, or click to select
                  </p>
                  <Button variant="secondary" className="mt-2">
                    Select Image
                  </Button>
                </div>
              </Dropzone>
            )}
          </div>
          {imageFile && (
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title for your image..."
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="description">Caption</Label>
                <Textarea
                  id="description"
                  value={description}
                  rows={5}
                  className="h-full"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for your image..."
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="tags">Location</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags for your image..."
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!imageFile || loading}>
            {loading ? <Spinner /> : "Upload Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
