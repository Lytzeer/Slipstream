/**
 * MODEL - Client Supabase
 *
 * Couche données : client Supabase pour l'authentification et les requêtes.
 * Storage adaptatif : localStorage (web) / AsyncStorage (natif) avec fallback mémoire.
 *
 * @see lib/controllers/auth.controller.ts pour la logique métier auth
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isWeb =
  Platform.OS === "web" ||
  (typeof window !== "undefined" && typeof localStorage !== "undefined");

const webStorage = {
  getItem: async (key: string) =>
    (typeof localStorage !== "undefined" ? localStorage.getItem(key) : null) ?? null,
  setItem: async (key: string, value: string) => {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  },
};

const memoryFallback = new Map<string, string>();

const nativeStorage = {
  getItem: async (key: string) => {
    try {
      const value = (await AsyncStorage.getItem(key)) ?? null;
      return value ?? memoryFallback.get(key) ?? null;
    } catch {
      return memoryFallback.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      /* Fallback en mémoire si AsyncStorage échoue */
    }
    memoryFallback.set(key, value);
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    memoryFallback.delete(key);
  },
};

const storage = isWeb ? webStorage : nativeStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isWeb,
  },
});
