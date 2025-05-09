"use client";

import ReelProvider from "@/contexts/reel-context";
import Reel from "./reel";
import ReelCommentsDrawer from "./reel-comments-drawer";
import ReelSkeleton from "./reel-skeleton";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import useReels from "./use-reels";

export default function ReelsContainer() {
  const { data, isFetchingNextPage, status, refetch } = useReels();

  const allVideos = data?.pages.flatMap((page) => page.videos) || [];

  if (status === "pending")
    return (
      <div className="scroll-container">
        <div className="reel-container">
          <ReelSkeleton />
        </div>
      </div>
    );
  if (status === "error")
    return (
      <div className="scroll-container">
        <div className="reel-container flex flex-col justify-center items-center h-screen gap-4 text-center bg-background rounded-lg">
          <AlertTriangle className="text-red-500 w-16 h-16" />
          <h2 className="text-xl font-semibold text-foreground">Oops! Something went wrong.</h2>
          <p className="text-sm text-muted-foreground">
            We couldn’t load the photos. Please check your internet connection or try again later.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );

  return (
    <ReelProvider>
      <div className="scroll-container">
        {allVideos.map((video, index) => (
          <div key={video._id} className="reel-container" data-index={index}>
            <Reel reel={video} />
          </div>
        ))}
        {isFetchingNextPage && <ReelSkeleton />}
      </div>
      <ReelCommentsDrawer />
    </ReelProvider>
  );
}
