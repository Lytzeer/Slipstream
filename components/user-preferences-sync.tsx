"use client";

import { isValidLocale } from "@/constants/locales";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useNotifications } from "@/contexts/notifications-context";
import { useTheme } from "@/contexts/theme-context";
import {
  fetchUserPreferences,
  upsertUserPreferences,
} from "@/lib/repositories/user-preferences.repository";
import React, { useEffect, useState } from "react";

const UPSERT_DEBOUNCE_MS = 500;

/**
 * Synchronise thème, langue et notifications avec `app.user_preferences` (Supabase)
 * lorsque l’utilisateur est connecté. Hors session, seuls AsyncStorage / état local s’appliquent.
 */
export const UserPreferencesSync = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const { colorScheme, setColorScheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const { notificationsEnabled, hydrateFromRemote } = useNotifications();

  const [remoteReady, setRemoteReady] = useState(false);

  useEffect(() => {
    if (!userId) {
      setRemoteReady(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const prefs = await fetchUserPreferences(userId);
      if (cancelled) return;
      if (prefs) {
        if (prefs.theme === "light" || prefs.theme === "dark") {
          await setColorScheme(prefs.theme);
        }
        if (isValidLocale(prefs.locale)) {
          await setLocale(prefs.locale);
        }
        await hydrateFromRemote(prefs.notifications_enabled);
      }
      if (!cancelled) setRemoteReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, setColorScheme, setLocale, hydrateFromRemote]);

  useEffect(() => {
    if (!userId || !remoteReady) return;
    const timer = setTimeout(() => {
      void upsertUserPreferences({
        user_id: userId,
        theme: colorScheme,
        locale,
        notifications_enabled: notificationsEnabled,
      });
    }, UPSERT_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [userId, remoteReady, colorScheme, locale, notificationsEnabled]);

  return null;
};
