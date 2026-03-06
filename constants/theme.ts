import { Platform } from "react-native";

// Design tokens statiques
export const colors = {
  primary: "#FF3B31",
  primaryAlt: "#FF383C",
  secondary: "#1C1E1D",
  background: "#151718",
  surface: "#2C2E2F",
  border: "#3C3C43",
  text: "#ECEDEE",
  textMuted: "#9BA1A6",
  textSecondary: "#8E8E93",
  white: "#fff",
  black: "#000",
  error: "#FF3B31",
  success: "#31D158",
  warning: "#FF9502",
} as const;

// Couleurs par thème (light/dark)
export const themeColors = {
  light: {
    background: "#FFFFFF",
    surface: "#F2F2F7",
    surfaceAlt: "#E5E5EA",
    text: "#1C1C1E",
    textMuted: "#8E8E93",
    textSecondary: "#3C3C43",
    border: "#E5E5EA",
    primary: "#FF3B31",
    tabIcon: "#8E8E93",
    tabIconSelected: "#FF3B31",
  },
  dark: {
    background: "#151718",
    surface: "#2C2E2F",
    surfaceAlt: "#3C3C43",
    text: "#ECEDEE",
    textMuted: "#9BA1A6",
    textSecondary: "#8E8E93",
    border: "#3C3C43",
    primary: "#FF3B31",
    tabIcon: "#9BA1A6",
    tabIconSelected: "#ECEDEE",
  },
} as const;

export type ColorScheme = keyof typeof themeColors;

// Legacy (collapsible, use-theme-color)
const tintLight = "#0a7ea4";
const tintDark = "#fff";
export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintDark,
  },
};

export const Fonts = Platform.select({
  ios: { sans: "system-ui", serif: "ui-serif", rounded: "ui-rounded", mono: "ui-monospace" },
  default: { sans: "normal", serif: "serif", rounded: "normal", mono: "monospace" },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
