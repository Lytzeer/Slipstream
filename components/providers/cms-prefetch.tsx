import {
  fetchChampionshipsCatalog,
  fetchUpcomingRacesFeed,
} from "@/lib/api/cms/controllers/championship.controller";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Précharge les données CMS clés au démarrage pour rendre les filtres instantanés.
 */
export const CmsPrefetch = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  useEffect(() => {
    let cancelled = false;

    const warmup = async () => {
      await queryClient.fetchQuery({
        queryKey: ["cms", "championships-catalog"],
        queryFn: fetchChampionshipsCatalog,
        staleTime: 90_000,
      });
      if (cancelled) return;

      await queryClient.prefetchQuery({
        queryKey: ["cms", "upcoming-races-feed", i18n.language],
        queryFn: () => fetchUpcomingRacesFeed(i18n.language),
        staleTime: 90_000,
      });
    };

    void warmup();

    return () => {
      cancelled = true;
    };
  }, [i18n.language, queryClient]);

  return null;
};
