import {
  fetchArticlesFeed,
  type CmsArticleItem,
} from "@/lib/api/cms/controllers/articles.controller";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useArticlesFeed = (locale: string) => {
  const query = useQuery({
    queryKey: ["cms", "articles-feed", locale],
    queryFn: () => fetchArticlesFeed(locale),
    staleTime: 90_000,
  });

  const articles = useMemo<CmsArticleItem[]>(() => {
    if (!query.data?.ok) return [];
    return query.data.data;
  }, [query.data]);

  const error = query.data && !query.data.ok ? query.data.error : null;

  return {
    articles,
    error,
    isLoading: query.isLoading || query.isFetching,
    refetch: () => query.refetch(),
  };
};
