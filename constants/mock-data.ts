import type { Championship } from "@/types";

export const championshipsList: Championship[] = [
  { id: "ELMS", name: "ELMS", color: "#FF3B31" },
  { id: "LMC", name: "Le Mans Cup", color: "#FF9502" },
  { id: "GTWORLD", name: "GT World", color: "#31D158" },
];

export type SavedArticle = {
  id: string;
  title: string;
  championship: string;
  date: string;
};

export const savedArticles: SavedArticle[] = [
  {
    id: "1",
    title: "Retour sur la victoire historique aux 24H du Mans",
    championship: "ELMS",
    date: "24 Déc 2024",
  },
  {
    id: "2",
    title: "Analyse technique : Les secrets de la Ferrari 499P",
    championship: "ELMS",
    date: "23 Déc 2024",
  },
  {
    id: "3",
    title: "Interview exclusive : Le pilote champion nous parle",
    championship: "Le Mans Cup",
    date: "22 Déc 2024",
  },
];
