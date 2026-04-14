import { fetchChampionshipsCatalog } from "@/lib/api/cms/controllers/championship.controller";
import { useQuery } from "@tanstack/react-query";
import type { ChampionshipRaw } from "@/types";
import { useMemo } from "react";

/**
 * Charge le catalogue championnats depuis le CMS uniquement (aucun repli local).
 */
export const useChampionshipsCatalog = () => {
  const query = useQuery({
    queryKey: ["cms", "championships-catalog"],
    queryFn: fetchChampionshipsCatalog,
    staleTime: 90_000,
  });

  const championships = useMemo<ChampionshipRaw[]>(() => {
    if (!query.data?.ok) return [];
    return query.data.data;
  }, [query.data]);

  const error = query.data && !query.data.ok ? query.data.error : null;

  return {
    championships,
    isLoading: query.isLoading || query.isFetching,
    error,
    refetch: () => query.refetch(),
  };
};
