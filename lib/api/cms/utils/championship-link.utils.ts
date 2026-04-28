import type { ChampionshipRaw } from "@/types";

export const normalizeLinkValue = (value: string): string =>
  value.trim().toLowerCase().replace(/[_\s]+/g, "-").replace(/-+/g, "-");

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const isUpperToken = (token: string) => token.length <= 4;

const toDisplayLabel = (linkValue: string): string =>
  linkValue
    .split("-")
    .filter(Boolean)
    .map((token) =>
      isUpperToken(token)
        ? token.toUpperCase()
        : `${token[0].toUpperCase()}${token.slice(1)}`
    )
    .join(" ");

const toChampionshipId = (linkValue: string): string =>
  linkValue.replace(/[^a-z0-9]+/g, "").toUpperCase().slice(0, 24) || "X";

const toDynamicColor = (seed: string): string => {
  const hue = hashString(seed) % 360;
  return `hsl(${hue} 72% 52%)`;
};

export const mapChampionshipLinkValueToRaw = (raw: string): ChampionshipRaw | null => {
  const v = normalizeLinkValue(raw);
  if (!v) return null;
  return {
    id: toChampionshipId(v),
    nameKey: "",
    color: toDynamicColor(v),
    linkValue: v,
    displayLabel: toDisplayLabel(v) || raw.trim(),
  };
};
