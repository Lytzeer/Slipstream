import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

const NOTIFICATIONS_STORAGE_KEY = "slipstream-notifications-enabled";

const isNotificationsSupported = () =>
  Platform.OS === "ios" || Platform.OS === "android";

if (isNotificationsSupported()) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {
    /* expo-notifications non disponible */
  }
}

let asyncStorageOk = true;
const memoryFallback = new Map<string, string>();

const safeSet = async (key: string, value: string) => {
  if (!asyncStorageOk) {
    memoryFallback.set(key, value);
    return;
  }
  try {
    await AsyncStorage.setItem(key, value);
    memoryFallback.set(key, value);
  } catch {
    asyncStorageOk = false;
    memoryFallback.set(key, value);
  }
};

const safeGet = async (key: string): Promise<string | null> => {
  if (!asyncStorageOk) return memoryFallback.get(key) ?? null;
  try {
    const v = await AsyncStorage.getItem(key);
    if (v !== null) memoryFallback.set(key, v);
    return v ?? memoryFallback.get(key) ?? null;
  } catch {
    asyncStorageOk = false;
    return memoryFallback.get(key) ?? null;
  }
};

const doRequestPermission = async (): Promise<boolean> => {
  try {
    let existing: string | undefined;
    try {
      const r = await Notifications.getPermissionsAsync();
      existing = r.status;
    } catch {
      existing = undefined;
    }
    if (existing === "granted") {
      await safeSet(NOTIFICATIONS_STORAGE_KEY, "true");
      return true;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === "granted";
    await safeSet(NOTIFICATIONS_STORAGE_KEY, granted ? "true" : "false");
    return granted;
  } catch {
    await safeSet(NOTIFICATIONS_STORAGE_KEY, "false");
    return false;
  }
};

export type RequestPermissionOptions = {
  showPrompt?: boolean;
  promptTitle?: string;
  promptMessage?: string;
  promptLater?: string;
  promptAllow?: string;
};

const defaultPrompt = {
  title: "Notifications",
  message: "Autorisez les notifications pour recevoir les alertes courses et actualités.",
  later: "Plus tard",
  allow: "Autoriser",
};

export const requestNotificationPermission = async (
  options?: RequestPermissionOptions
): Promise<boolean> => {
  if (!isNotificationsSupported()) {
    await safeSet(NOTIFICATIONS_STORAGE_KEY, "false");
    return false;
  }
  if (options?.showPrompt) {
    return new Promise((resolve) => {
      Alert.alert(
        options.promptTitle ?? defaultPrompt.title,
        options.promptMessage ?? defaultPrompt.message,
        [
          {
            text: options.promptLater ?? defaultPrompt.later,
            style: "cancel",
            onPress: async () => {
              await safeSet(NOTIFICATIONS_STORAGE_KEY, "false");
              resolve(false);
            },
          },
          {
            text: options.promptAllow ?? defaultPrompt.allow,
            onPress: async () => {
              const granted = await doRequestPermission();
              resolve(granted);
            },
          },
        ]
      );
    });
  }
  return doRequestPermission();
};

export const getNotificationsEnabled = async (): Promise<boolean> => {
  if (!isNotificationsSupported()) return false;
  try {
    const stored = await safeGet(NOTIFICATIONS_STORAGE_KEY);
    if (stored !== null) return stored === "true";
    const { status } = await Notifications.getPermissionsAsync();
    const granted = status === "granted";
    await safeSet(NOTIFICATIONS_STORAGE_KEY, granted ? "true" : "false");
    return granted;
  } catch {
    return false;
  }
};

export const setNotificationsEnabled = async (enabled: boolean): Promise<void> => {
  await safeSet(NOTIFICATIONS_STORAGE_KEY, enabled ? "true" : "false");
};
