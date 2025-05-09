import { getFeedVideos } from "@/services/videos-api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function useReels() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const { data, isFetchingNextPage, fetchNextPage, status, refetch } = useInfiniteQuery({
    queryKey: ["feedVideos", search],
    initialPageParam: undefined,
    queryFn: ({ pageParam = undefined }) => getFeedVideos({ cursor: pageParam, search }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return { data, isFetchingNextPage, fetchNextPage, status, refetch };
}
