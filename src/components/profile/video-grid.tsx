"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getCreatorVideos } from "@/services/videos-api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import Reel, { Video } from "../reels/reel";

export default function VideoGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: videos,
    isLoading,
    error,
  } = useQuery<{ results: Video[]; totalResults: number }>({
    queryKey: ["user-videos"],
    queryFn: () => getCreatorVideos(),
  });

  const handleVideoClick = useCallback(
    (video: Video) => {
      setSelectedVideo(video);
      setIsDialogOpen(true);
      router.push(`?video=${video._id}`, { scroll: false });
    },
    [router]
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedVideo(null);
    router.push("?", { scroll: false });
  }, [router]);

  useEffect(() => {
    const videoId = searchParams.get("video");
    if (videoId && videos) {
      const video = videos.results.find((v) => v._id === videoId);
      if (video) {
        setSelectedVideo(video);
        setIsDialogOpen(true);
      }
    }
  }, [searchParams, videos]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="w-full h-[300px]" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load photos. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!videos || videos.totalResults === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Photos</AlertTitle>
        <AlertDescription>
          You haven&apos;t uploaded any photos yet. Start creating!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {videos.results.map((video) => (
          <Card
            key={video.url}
            className="overflow-hidden group cursor-pointer"
            onClick={() => handleVideoClick(video)}
          >
            <CardContent className="p-0 relative">
              <img src={video.url} className="w-full h-[350px] object-contain" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold truncate">{video.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2 text-white">
                    <Eye className="h-4 w-4" />
                    <span>{video.views}</span>
                    <Heart className="h-4 w-4 ml-2" />
                    <span>{video.likes}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{video.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <DialogContent className="max-w-full h-full p-0">
          {selectedVideo && (
            <div className="w-full h-full flex items-center justify-center bg-background/30">
              <Reel reel={selectedVideo} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
