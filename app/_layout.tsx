import "@/lib/i18n";
import { CmsPrefetch } from "@/components/providers/cms-prefetch";
import { AppQueryProvider } from "@/components/providers/query-provider";
import { UserPreferencesSync } from "@/components/user-preferences-sync";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { NotificationsProvider } from "@/contexts/notifications-context";
import { ThemeProvider as AppThemeProvider, useTheme } from "@/contexts/theme-context";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

function StatusBarTheme() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <AppQueryProvider>
        <AppThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <NotificationsProvider>
                <UserPreferencesSync />
              <CmsPrefetch />
                <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
                  <Stack.Screen name="index" options={{ animation: "none" }} />
                  <Stack.Screen name="onBoarding" options={{ animation: "slide_from_left" }} />
                  <Stack.Screen
                    name="advanced-settings"
                    options={{ animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="article/[id]"
                    options={{ animation: "slide_from_right" }}
                  />
                </Stack>
                <StatusBarTheme />
              </NotificationsProvider>
            </AuthProvider>
          </LanguageProvider>
        </AppThemeProvider>
      </AppQueryProvider>
    </ThemeProvider>
  );
}
