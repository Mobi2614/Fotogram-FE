import { useEffect, useRef } from "react";

type UseVideoInViewOptions = {
  threshold?: number;
};

export function useVideoInView({ threshold = 1 }: UseVideoInViewOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.load();
          videoRef.current?.pause();
        }
      },
      { threshold }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [threshold]);

  return videoRef;
}
