/**
 * VIEW - Écran profil
 *
 * Affiche les infos utilisateur (via user.model) et les paramètres.
 */

import {
  ChampionshipToggleRow,
  LanguageModal,
  LoadingScreen,
  SavedArticleCard,
  SectionCard,
  SettingRow,
  StatCard,
} from "@/components/ui";
import { championshipsList, savedArticles } from "@/constants/mock-data";
import { colors as designTokens } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useNotifications } from "@/contexts/notifications-context";
import { useTheme } from "@/contexts/theme-context";
import {
  formatMemberSince,
  getAvatarUrl,
  getDisplayName,
} from "@/lib/models/user.model";
import { Image } from "expo-image";
import { Bell, Globe, Info, Moon, Settings, User } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user, isLoading } = useAuth();
  const { colors, isDark, setColorScheme } = useTheme();
  const { languageLabel } = useLanguage();
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();
  const { t } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [followedChampionships, setFollowedChampionships] = useState<
    Record<string, boolean>
  >({
    ELMS: true,
    LMC: true,
    GTWORLD: false,
  });

  const toggleChampionship = (id: string) => {
    setFollowedChampionships((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const avatarUrl = getAvatarUrl(user);
  const displayName = getDisplayName(user, t);
  const memberSince = user?.created_at
    ? formatMemberSince(user.created_at, t)
    : null;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.text }]}>
        {t("profile.title")}
      </Text>

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <User size={40} color={colors.text} strokeWidth={2} />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: colors.text }]}>
            {displayName}
          </Text>
          {memberSince && (
            <Text style={[styles.memberSince, { color: colors.textMuted }]}>
              {memberSince}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.stats}>
        <StatCard value="127" label={t("profile.articlesRead")} color={colors.primary} />
        <StatCard value="3" label={t("profile.championships")} color={designTokens.warning} />
        <StatCard value="3" label={t("profile.saved")} color={designTokens.success} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("profile.settings")}
      </Text>
      <SectionCard>
        <SettingRow
          icon={Bell}
          iconBgColor="#FF3B31"
          title={t("profile.notifications")}
          subtitle={t("profile.notificationsSubtitle")}
          value={notificationsEnabled}
          onValueChange={(v) => setNotificationsEnabled(v)}
          showSwitch
        />
        <SettingRow
          icon={Moon}
          iconBgColor="#FF9502"
          title={t("profile.darkMode")}
          subtitle={isDark ? t("profile.darkModeOn") : t("profile.darkModeOff")}
          value={isDark}
          onValueChange={(v) => setColorScheme(v ? "dark" : "light")}
          showSwitch
        />
        <SettingRow
          icon={Globe}
          iconBgColor="#31D158"
          title={t("profile.language")}
          subtitle={languageLabel}
          showChevron
          isLast
          onPress={() => setLanguageModalVisible(true)}
        />
      </SectionCard>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("profile.followedChampionships")}
      </Text>
      <SectionCard>
        {championshipsList.map((champ, index) => (
          <ChampionshipToggleRow
            key={champ.id}
            name={t(champ.nameKey)}
            color={champ.color}
            value={followedChampionships[champ.id] ?? false}
            onValueChange={() => toggleChampionship(champ.id)}
            isLast={index === championshipsList.length - 1}
          />
        ))}
      </SectionCard>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("profile.savedArticles")}{" "}
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          ({savedArticles.length})
        </Text>
      </Text>
      <View style={styles.savedSection}>
        {savedArticles.map((article) => (
          <SavedArticleCard
            key={article.id}
            title={t(article.titleKey)}
            championship={t(`championships.${article.championshipId}`)}
            date={t(article.dateKey)}
          />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("profile.other")}
      </Text>
      <SectionCard>
        <SettingRow icon={Settings} title={t("profile.advancedSettings")} showChevron />
        <SettingRow icon={Info} title={t("profile.about")} showChevron isLast />
      </SectionCard>

      <View style={styles.bottomSpacer} />

      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ECEDEE",
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF9502",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  userInfo: { flex: 1 },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ECEDEE",
  },
  memberSince: {
    fontSize: 14,
    color: "#9BA1A6",
    marginTop: 4,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ECEDEE",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9BA1A6",
  },
  savedSection: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  bottomSpacer: { height: 40 },
});
