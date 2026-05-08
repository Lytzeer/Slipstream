"use client";

/**
 * Contexte thème (dark/light mode)
 *
 * Persiste le choix utilisateur dans AsyncStorage.
 */

import { themeColors, type ColorScheme } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useSystemColorScheme } from "react-native";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "slipstream-theme";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  colors: (typeof themeColors)[ColorScheme];
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          setColorSchemeState(stored);
        } else {
          setColorSchemeState(systemScheme ?? "dark");
        }
      } catch {
        setColorSchemeState(systemScheme ?? "dark");
      }
      setIsLoaded(true);
    };
    load();
  }, [systemScheme]);

  const value: ThemeContextValue = {
    colorScheme,
    setColorScheme,
    colors: themeColors[colorScheme],
    isDark: colorScheme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
};
