import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider as AppThemeProvider, useTheme } from "@/contexts/theme-context";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

function StatusBarTheme() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AppThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="index" options={{ animation: "none" }} />
            <Stack.Screen name="onBoarding" options={{ animation: "slide_from_left" }} />
          </Stack>
          <StatusBarTheme />
        </AuthProvider>
      </AppThemeProvider>
    </ThemeProvider>
  );
}
