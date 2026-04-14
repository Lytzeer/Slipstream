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
