import type { CalendarRace, ChampionshipRaw, NewsArticle } from "@/types";

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

export const calendarRaces: CalendarRace[] = [
  {
    id: "1",
    nameKey: "calendar.race1Name",
    championshipId: "ELMS",
    circuitKey: "calendar.race1Circuit",
    country: "France",
    date: "03 Mai 2026",
    time: "11:00",
    completed: false,
  },
  {
    id: "2",
    nameKey: "calendar.race2Name",
    championshipId: "LMC",
    circuitKey: "calendar.race2Circuit",
    country: "Italie",
    date: "05 Juillet 2026",
    time: "14:30",
    completed: false,
  },
  {
    id: "3",
    nameKey: "calendar.race3Name",
    championshipId: "GTWORLD",
    circuitKey: "calendar.race3Circuit",
    country: "Belgique",
    date: "26 Juillet 2026",
    time: "13:00",
    completed: false,
  },
  {
    id: "4",
    nameKey: "calendar.race4Name",
    championshipId: "ELMS",
    circuitKey: "calendar.race4Circuit",
    country: "Portugal",
    date: "15 Mars 2026",
    time: "11:00",
    completed: true,
  },
  {
    id: "5",
    nameKey: "calendar.race5Name",
    championshipId: "LMC",
    circuitKey: "calendar.race5Circuit",
    country: "Espagne",
    date: "22 Février 2026",
    time: "14:00",
    completed: true,
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    titleKey: "news.article1Title",
    championshipId: "ELMS",
    categoryKey: "news.categoryAnalysis",
    date: "24 Mar 2026",
    readTimeKey: "news.article1ReadTime",
  },
  {
    id: "2",
    titleKey: "news.article2Title",
    championshipId: "LMC",
    categoryKey: "news.categoryResult",
    date: "22 Mar 2026",
    readTimeKey: "news.article2ReadTime",
  },
  {
    id: "3",
    titleKey: "news.article3Title",
    championshipId: "GTWORLD",
    categoryKey: "news.categoryPreview",
    date: "20 Mar 2026",
    readTimeKey: "news.article3ReadTime",
  },
  {
    id: "4",
    titleKey: "news.article4Title",
    championshipId: "ELMS",
    categoryKey: "news.categoryInterview",
    date: "18 Mar 2026",
    readTimeKey: "news.article4ReadTime",
  },
  {
    id: "5",
    titleKey: "news.article5Title",
    championshipId: "LMC",
    categoryKey: "news.categoryAnalysis",
    date: "15 Mar 2026",
    readTimeKey: "news.article5ReadTime",
  },
  {
    id: "6",
    titleKey: "news.article6Title",
    championshipId: "GTWORLD",
    categoryKey: "news.categoryResult",
    date: "12 Mar 2026",
    readTimeKey: "news.article6ReadTime",
  },
];

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
