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

  const upcomingRaces = useMemo<ChampionshipRaceFeedItem[]>(() => {
    if (!query.data?.ok) return [];
    return query.data.upcoming;
  }, [query.data]);

  const pastRaces = useMemo<ChampionshipRaceFeedItem[]>(() => {
    if (!query.data?.ok) return [];
    return query.data.past;
  }, [query.data]);

  const error = query.data && !query.data.ok ? query.data.error : null;

  return {
    upcomingRaces,
    pastRaces,
    error,
    isLoading: query.isLoading || query.isFetching,
    refetch: () => query.refetch(),
  };
};
