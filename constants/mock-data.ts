/**
 * Liste statique de secours — préférer `useChampionshipsCatalog()` ou
 * `fetchChampionshipsCatalog()` pour la donnée CMS.
 */
export { CHAMPIONSHIPS_CATALOG_FALLBACK as championshipsList } from "@/lib/api/cms/controllers/championship.controller";

export type SavedArticle = {
  id: string;
  titleKey: string;
  championshipId: string;
  dateKey: string;
};

export const savedArticles: SavedArticle[] = [
  {
    id: "1",
    titleKey: "articles.saved1",
    championshipId: "ELMS",
    dateKey: "articles.saved1Date",
  },
  {
    id: "2",
    titleKey: "articles.saved2",
    championshipId: "ELMS",
    dateKey: "articles.saved2Date",
  },
  {
    id: "3",
    titleKey: "articles.saved3",
    championshipId: "LMC",
    dateKey: "articles.saved3Date",
  },
];
