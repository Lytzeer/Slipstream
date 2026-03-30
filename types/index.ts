export type Championship = { id: string; name: string; color: string };
export type ChampionshipRaw = { id: string; nameKey: string; color: string };
export type Race = { name: string; date: string; circuit: string };
export type CalendarRace = {
  id: string;
  nameKey: string;
  championshipId: string;
  circuitKey: string;
  country: string;
  date: string;
  time: string;
  completed: boolean;
};

export type NewsArticle = {
  id: string;
  titleKey: string;
  championshipId: string;
  categoryKey: string;
  date: string;
  readTimeKey: string;
};
