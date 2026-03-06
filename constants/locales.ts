export const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
] as const;

export type Locale = (typeof LANGUAGES)[number]["code"];

export const getLanguageLabel = (code: Locale) =>
  LANGUAGES.find((l) => l.code === code)?.label ?? "Français";
