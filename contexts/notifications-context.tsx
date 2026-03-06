"use client";

import {
  getNotificationsEnabled,
  requestNotificationPermission,
  setNotificationsEnabled as setStorage,
} from "@/lib/notifications";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type NotificationsContextValue = {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  requestPermissionAfterLogin: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [notificationsEnabled, setState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getNotificationsEnabled().then((enabled) => {
      setState(enabled);
      setIsLoaded(true);
    });
  }, []);

  const NOTIFICATION_REQUEST_DELAY_MS = 3000;

  const requestPermissionAfterLogin = useCallback((): void => {
    setTimeout(() => {
      requestNotificationPermission({
        showPrompt: true,
        promptTitle: t("notifications.promptTitle"),
        promptMessage: t("notifications.promptMessage"),
        promptLater: t("notifications.promptLater"),
        promptAllow: t("notifications.promptAllow"),
      }).then((granted) => setState(granted));
    }, NOTIFICATION_REQUEST_DELAY_MS);
  }, [t]);

  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission({
        showPrompt: true,
        promptTitle: t("notifications.promptTitle"),
        promptMessage: t("notifications.promptMessage"),
        promptLater: t("notifications.promptLater"),
        promptAllow: t("notifications.promptAllow"),
      });
      setState(granted);
      return;
    }
    await setStorage(false);
    setState(false);
  }, [t]);

  const value: NotificationsContextValue = {
    notificationsEnabled,
    setNotificationsEnabled,
    requestPermissionAfterLogin,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé dans un NotificationsProvider");
  }
  return context;
};
