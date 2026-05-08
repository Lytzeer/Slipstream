"use client";

import { LANGUAGES, type Locale } from "@/constants/locales";
import { changeLanguage as i18nChangeLanguage } from "@/lib/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const LANGUAGE_STORAGE_KEY = "slipstream-language";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  languageLabel: string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const VALID_LOCALES: Locale[] = ["fr", "en", "es", "de", "it", "pt-BR"];

const getSystemLocale = (): Locale => {
  const locales = Localization.getLocales();
  const system = locales[0];
  const tag = system?.languageTag ?? "";
  const code = system?.languageCode ?? "";
  if (tag.startsWith("pt-BR") || tag === "pt-BR" || code === "pt-BR") return "pt-BR";
  if (code === "pt") return "pt-BR";
  const short = code.slice(0, 2);
  if (short && VALID_LOCALES.includes(short as Locale)) return short as Locale;
  return "fr";
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [isLoaded, setIsLoaded] = useState(false);

  const setLocale = useCallback(async (newLocale: Locale) => {
    setLocaleState(newLocale);
    i18nChangeLanguage(newLocale);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        const initialLocale =
          stored && VALID_LOCALES.includes(stored as Locale)
            ? (stored as Locale)
            : getSystemLocale();
        setLocaleState(initialLocale);
        i18nChangeLanguage(initialLocale);
      } catch {
        const fallback = getSystemLocale();
        setLocaleState(fallback);
        i18nChangeLanguage(fallback);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  const languageLabel = LANGUAGES.find((l) => l.code === locale)?.label ?? "Français";

  const value: LanguageContextValue = {
    locale,
    setLocale,
    languageLabel,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage doit être utilisé dans un LanguageProvider");
  }
  return context;
};
