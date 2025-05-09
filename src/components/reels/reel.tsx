"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { likeVideo, viewVideo } from "@/services/videos-api";
import { cn } from "@/lib/utils";
import { useElementIntersection } from "@/hooks/use-element-intersection";
import { useUser } from "@/contexts/user-context";

export interface Video {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  creator: string;
  url: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
  likedByUser?: boolean;
}

export default function Reel({ reel }: { reel: Video }) {
  const [hasViewed, setHasViewed] = useState(false);
  const [isLiked, setIsLiked] = useState(reel.likedByUser || false);
  const [likes, setLikes] = useState(reel.likes);
  const [views, setViews] = useState(reel.views);

  const { isLoggedIn } = useUser();
  const { elementRef, isIntersecting } = useElementIntersection({ threshold: 0.5 });

  const { mutate: likeVideoMutation } = useMutation({
    mutationKey: ["like-video"],
    mutationFn: () => likeVideo(reel._id),
  });

  const { mutate: viewVideoMutation } = useMutation({
    mutationKey: ["view-video"],
    mutationFn: () => viewVideo(reel._id),
  });

  const handleLikeVideo = () => {
    if (!isLoggedIn) return;
    setIsLiked(true);
    setLikes((prev) => prev + 1);
    likeVideoMutation();
  };

  const handleViewImage = useCallback(() => {
    if (!isLoggedIn || hasViewed) return; // Prevent multiple calls
    setHasViewed(true);
    setViews((prev) => prev + 1);
    viewVideoMutation();
  }, [isLoggedIn, hasViewed, viewVideoMutation]);

  useEffect(() => {
    if (isIntersecting && !hasViewed) {
      // Count a view when the image is in view
      handleViewImage();
    }
  }, [isIntersecting, handleViewImage, hasViewed]);

  return (
    <section ref={elementRef} className="reel-container bg-background">
      <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full lg:p-4">
        <div className="relative reel dark:bg-white/10 bg-black/10 h-full mx-auto lg:rounded-2xl">
          <div className="relative w-full h-full">
            <Image
              src={reel.thumbnailUrl || reel.url}
              alt={reel.title}
              fill
              className="object-contain lg:rounded-2xl"
              priority
            />
          </div>
          <VideoInfo title={reel.title} description={reel.description} tags={reel.tags} />
          <div className="absolute bottom-10 lg:-right-20 right-0">
            <div className="flex flex-col gap-2 w-20 justify-end items-center text-xs font-medium">
              <ReelAction
                action={handleLikeVideo}
                icon={<Heart className={cn(isLiked ? "fill-foreground" : "")} />}
                label={String(likes)}
              />
              <ReelAction action={() => {}} icon={<Eye />} label={String(views)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ReelProps {
  icon: React.ReactNode;
  label: string;
  action?: () => void;
}

function ReelAction({ icon, label, action }: ReelProps) {
  return (
    <div className="text-center flex flex-col items-center">
      <Button onClick={action} variant="ghost" size="icon">
        {icon}
      </Button>
      <span>{label}</span>
    </div>
  );
}

interface VideoInfoProps {
  title: string;
  description: string;
  tags: string[];
}

export const VideoInfo: React.FC<VideoInfoProps> = ({ title, description, tags }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
      <h2 className="text-white font-bold text-lg truncate" title={title}>
        {title}
      </h2>
      <p className="text-white text-sm truncate" title={description}>
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
