import type { ChampionshipRaw } from "@/types";

export const championshipsList: ChampionshipRaw[] = [
  { id: "ELMS", nameKey: "championships.ELMS", color: "#FF3B31" },
  { id: "LMC", nameKey: "championships.LMC", color: "#FF9502" },
  { id: "GTWORLD", nameKey: "championships.GTWORLD", color: "#31D158" },
];

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
