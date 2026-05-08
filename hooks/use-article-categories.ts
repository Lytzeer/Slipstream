import {
  fetchArticleCategories,
  type CmsArticleCategory,
} from "@/lib/api/cms/controllers/articles.controller";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useArticleCategories = () => {
  const query = useQuery({
    queryKey: ["cms", "article-categories"],
    queryFn: fetchArticleCategories,
    staleTime: 90_000,
  });

  const categories = useMemo<CmsArticleCategory[]>(() => {
    if (!query.data?.ok) return [];
    return query.data.data;
  }, [query.data]);

  return {
    categories,
    isLoading: query.isLoading || query.isFetching,
    error: query.data && !query.data.ok ? query.data.error : null,
  };
};
