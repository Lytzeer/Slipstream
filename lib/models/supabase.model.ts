/**
 * MODEL - Client Supabase
 *
 * Couche données : client Supabase pour l'authentification et les requêtes.
 * Storage adaptatif : localStorage (web) / AsyncStorage (natif) avec fallback mémoire.
 * En Expo Go Android, AsyncStorage peut échouer → fallback mémoire uniquement.
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

let asyncStorageAvailable: boolean | null = null;

const checkAsyncStorage = async (): Promise<boolean> => {
  if (asyncStorageAvailable !== null) return asyncStorageAvailable;
  try {
    await AsyncStorage.getItem("__slipstream_storage_check__");
    asyncStorageAvailable = true;
  } catch {
    asyncStorageAvailable = false;
  }
  return asyncStorageAvailable;
};

const nativeStorage = {
  getItem: async (key: string) => {
    if (!(await checkAsyncStorage())) return memoryFallback.get(key) ?? null;
    try {
      const value = (await AsyncStorage.getItem(key)) ?? null;
      return value ?? memoryFallback.get(key) ?? null;
    } catch {
      return memoryFallback.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string) => {
    memoryFallback.set(key, value);
    if (!(await checkAsyncStorage())) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      /* Fallback mémoire déjà mis à jour */
    }
  },
  removeItem: async (key: string) => {
    memoryFallback.delete(key);
    if (!(await checkAsyncStorage())) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      /* ignore */
    }
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
