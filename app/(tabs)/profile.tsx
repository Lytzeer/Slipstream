/**
 * VIEW - Écran profil
 *
 * Affiche les infos utilisateur (via user.model) et les paramètres.
 */

import {
  ChampionshipsModal,
  LanguageModal,
  LoadingScreen,
  SavedArticleCard,
  SectionCard,
  SettingRow,
  StatCard,
} from "@/components/ui";
import { savedArticles } from "@/constants/mock-data";
import { getChampionshipDisplayName } from "@/lib/api/cms/models/championship-label.model";
import { useChampionshipsCatalog } from "@/hooks/use-championships-catalog";
import {
  fetchUserFollowedChampionshipIds,
  replaceUserFollowedChampionshipIds,
} from "@/lib/database/controllers/user-followed-championships.controller";
import { colors as designTokens, tintDark, tintLight } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useNotifications } from "@/contexts/notifications-context";
import { useTheme } from "@/contexts/theme-context";
import {
  formatMemberSince,
  getAvatarUrl,
  getDisplayName,
} from "@/lib/domain/user/user.model";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, Globe, Info, Moon, Settings, User } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { colors, isDark, setColorScheme } = useTheme();
  const tintIconBg = isDark ? tintDark : tintLight;
  const tintIconFg = isDark ? "#111828" : "#ffffff";
  const { languageLabel } = useLanguage();
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();
  const { t } = useTranslation();
  const {
    championships: championshipsCatalog,
    error: championshipsError,
    isLoading: championshipsLoading,
  } = useChampionshipsCatalog();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [championshipsModalVisible, setChampionshipsModalVisible] = useState(false);
  const [followedChampionships, setFollowedChampionships] = useState<Record<string, boolean>>({});
  const loadedFollowedForUserRef = useRef<string | null>(null);

  const championshipsSummary = useMemo(() => {
    const names = championshipsCatalog
      .filter((c) => followedChampionships[c.id])
      .map((c) => getChampionshipDisplayName(c, t));
    return names.length ? names.join(", ") : "—";
  }, [championshipsCatalog, followedChampionships, t]);

  const followedChampionshipsCount = useMemo(
    () =>
      championshipsCatalog.filter((c) => followedChampionships[c.id]).length,
    [championshipsCatalog, followedChampionships]
  );

  useEffect(() => {
    if (championshipsCatalog.length === 0) {
      setFollowedChampionships({});
      return;
    }
    setFollowedChampionships((prev) => {
      const next: Record<string, boolean> = {};
      for (const champ of championshipsCatalog) {
        // Aucun auto-follow implicite : la source de vérité est la DB.
        next[champ.id] = prev[champ.id] ?? false;
      }
      return next;
    });
  }, [championshipsCatalog]);

  useEffect(() => {
    const userId = user?.id ?? null;
    if (!userId || championshipsCatalog.length === 0) return;
    if (loadedFollowedForUserRef.current === userId) return;

    let cancelled = false;
    (async () => {
      const ids = await fetchUserFollowedChampionshipIds(userId);
      if (cancelled) return;
      setFollowedChampionships((prev) => {
        const next: Record<string, boolean> = { ...prev };
        for (const champ of championshipsCatalog) {
          next[champ.id] = ids.has(champ.id);
        }
        return next;
      });
      loadedFollowedForUserRef.current = userId;
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, championshipsCatalog]);

  const avatarUrl = getAvatarUrl(user);
  const displayName = getDisplayName(user, t);
  const memberSince = user?.created_at
    ? formatMemberSince(user.created_at, t)
    : null;

  const handleAdvancedSettingsPress = () => {
    router.push("/advanced-settings");
  };

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
        <StatCard
          value={
            championshipsError
              ? "—"
              : championshipsLoading
                ? "…"
                : String(championshipsCatalog.length)
          }
          label={t("profile.championships")}
          color={isDark ? tintDark : tintLight}
        />
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
          iconBgColor={tintIconBg}
          iconColor={tintIconFg}
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
      {championshipsLoading ? (
        <View style={styles.championshipsButtonWrap}>
          <SectionCard>
            <View style={styles.championshipsLoadingBox}>
              <ActivityIndicator color={colors.primary} />
            </View>
          </SectionCard>
        </View>
      ) : championshipsError ? (
        <View style={styles.championshipsButtonWrap}>
          <SectionCard>
            <View style={styles.championshipsErrorBox}>
              <Text style={[styles.championshipsErrorText, { color: designTokens.error }]}>
                {t(championshipsError)}
              </Text>
            </View>
          </SectionCard>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.championshipsButtonWrap}
          activeOpacity={0.7}
          onPress={() => setChampionshipsModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={t("profile.followedChampionships")}
        >
          <SectionCard>
            <View style={styles.championshipsButtonRow}>
              <View style={styles.championshipsButtonTextCol}>
                <Text
                  style={[styles.championshipsButtonSummary, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {championshipsSummary}
                </Text>
                <Text style={[styles.championshipsButtonMeta, { color: colors.textMuted }]}>
                  {t("profile.championships")} • {followedChampionshipsCount}/
                  {championshipsCatalog.length}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </SectionCard>
        </TouchableOpacity>
      )}

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
        <SettingRow
          icon={Settings}
          title={t("profile.advancedSettings")}
          showChevron
          onPress={handleAdvancedSettingsPress}
        />
        <SettingRow icon={Info} title={t("profile.about")} showChevron isLast />
      </SectionCard>

      <View style={styles.bottomSpacer} />

      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
      <ChampionshipsModal
        visible={championshipsModalVisible && !championshipsError}
        onClose={() => setChampionshipsModalVisible(false)}
        championships={championshipsCatalog}
        followedChampionships={followedChampionships}
        onApply={(next) => {
          setFollowedChampionships(next);
          const userId = user?.id;
          if (!userId) return;
          const ids = championshipsCatalog
            .filter((champ) => next[champ.id])
            .map((champ) => champ.id);
          void replaceUserFollowedChampionshipIds(userId, ids);
        }}
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
  championshipsButtonWrap: {
    marginBottom: 24,
  },
  championshipsLoadingBox: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  championshipsErrorBox: {
    padding: 16,
  },
  championshipsErrorText: {
    fontSize: 15,
    fontWeight: "500",
  },
  championshipsButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  championshipsButtonTextCol: {
    flex: 1,
  },
  championshipsButtonSummary: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
  championshipsButtonMeta: {
    fontSize: 13,
    marginTop: 4,
  },
  savedSection: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  bottomSpacer: { height: 40 },
});
