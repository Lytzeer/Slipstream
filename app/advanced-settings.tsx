import { SectionCard, SettingRow } from "@/components/ui";
import { colors as designTokens } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "expo-router";
import { ChevronLeft, LogOut, Shield } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AdvancedSettingsScreen() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onBoarding");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t("profile.advancedSettings")}</Text>
      </View>

      <SectionCard>
        <SettingRow
          icon={LogOut}
          iconBgColor={designTokens.error}
          title={t("profile.logout")}
          subtitle={t("profile.logoutSubtitle")}
          onPress={() => {
            void handleSignOut();
          }}
          showChevron
        />
        <SettingRow
          icon={Shield}
          title={t("profile.sessionManagedBySupabase")}
          subtitle={t("profile.sessionManagedBySupabaseHint")}
          isLast
        />
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
