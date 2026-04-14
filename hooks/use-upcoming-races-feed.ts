import {
  fetchUpcomingRacesFeed,
  type ChampionshipRaceFeedItem,
} from "@/lib/api/cms/controllers/championship.controller";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUpcomingRacesFeed = (locale: string) => {
  const query = useQuery({
    queryKey: ["cms", "upcoming-races-feed", locale],
    queryFn: () => fetchUpcomingRacesFeed(locale),
    staleTime: 90_000,
  });

  const races = useMemo<ChampionshipRaceFeedItem[]>(() => {
    if (!query.data?.ok) return [];
    return query.data.data;
  }, [query.data]);

  const source = query.data && query.data.ok ? query.data.source : "upcoming";
  const error = query.data && !query.data.ok ? query.data.error : null;

  return {
    races,
    source,
    error,
    isLoading: query.isLoading || query.isFetching,
    refetch: () => query.refetch(),
  };
};
