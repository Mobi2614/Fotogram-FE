import { Skeleton } from "@/components/ui/skeleton";

function ReelSkeleton() {
  return (
    <section className="reel-container bg-background">
      <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full lg:p-4">
        <div className="relative reel dark:bg-white/10 bg-black/10 h-full mx-auto lg:rounded-2xl">
          {/* Video Skeleton */}
          <Skeleton className="w-full h-full lg:rounded-2xl" />

          {/* Action Buttons Skeleton */}
          <div className="absolute bottom-10 lg:-right-20 right-0">
            <div className="flex flex-col gap-2 w-20 justify-end items-center text-xs font-medium">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center flex flex-col items-center gap-1">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-8 h-4 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReelSkeleton;
