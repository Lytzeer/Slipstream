import { fetchChampionshipsCatalog } from "@/lib/api/cms/controllers/championship.controller";
import type { ChampionshipRaw } from "@/types";
import { useCallback, useEffect, useState } from "react";

type State = {
  championships: ChampionshipRaw[];
  isLoading: boolean;
  /** Clé i18n (`cms.apiError`) si l’API a échoué — pas de données mock */
  error: string | null;
};

/**
 * Charge le catalogue championnats depuis le CMS uniquement (aucun repli local).
 */
export const useChampionshipsCatalog = () => {
  const [state, setState] = useState<State>({
    championships: [],
    isLoading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    const result = await fetchChampionshipsCatalog();
    if (result.ok) {
      setState({ championships: result.data, isLoading: false, error: null });
    } else {
      setState({ championships: [], isLoading: false, error: result.error });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchChampionshipsCatalog();
      if (cancelled) return;
      if (result.ok) {
        setState({ championships: result.data, isLoading: false, error: null });
      } else {
        setState({ championships: [], isLoading: false, error: result.error });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...state, refetch };
};
