import type { ChampionshipRaw } from "@/types";

/**
 * Libellé affiché : traduction `nameKey` ou libellé CMS si `displayLabel` est défini.
 */
export const getChampionshipDisplayName = (
  champ: ChampionshipRaw,
  t: (key: string) => string
): string => {
  if (champ.displayLabel) return champ.displayLabel;
  if (!champ.nameKey?.trim()) return champ.id;
  const translated = t(champ.nameKey);
  if (translated === champ.nameKey) return champ.id;
  return translated;
};
