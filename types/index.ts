export type Championship = { id: string; name: string; color: string };
export type ChampionshipRaw = {
  id: string;
  nameKey: string;
  color: string;
  /** Valeur CMS pour `linkField=championship&linkValue=` (souvent minuscule, ex. elms) */
  linkValue?: string;
  /** Libellé si pas de clé i18n (championnat dynamique depuis le CMS) */
  displayLabel?: string;
};
export type Race = { name: string; date: string; circuit: string };
