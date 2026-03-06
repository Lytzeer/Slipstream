/**
 * VIEW - Écran profil
 *
 * Affiche les infos utilisateur (via user.model) et les paramètres.
 */

import {
  ChampionshipToggleRow,
  LoadingScreen,
  SavedArticleCard,
  SectionCard,
  SettingRow,
  StatCard,
} from "@/components/ui";
import { championshipsList, savedArticles } from "@/constants/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import {
  formatMemberSince,
  getAvatarUrl,
  getDisplayName,
} from "@/lib/models/user.model";
import { Image } from "expo-image";
import {
  Bell,
  Globe,
  Info,
  Moon,
  Settings,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user, isLoading } = useAuth();
  const { colors, isDark, setColorScheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
  const displayName = getDisplayName(user);
  const memberSince = user?.created_at
    ? formatMemberSince(user.created_at)
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
      <Text style={[styles.pageTitle, { color: colors.text }]}>Profil</Text>

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
          <Text style={[styles.username, { color: colors.text }]}>{displayName}</Text>
          {memberSince && (
            <Text style={[styles.memberSince, { color: colors.textMuted }]}>{memberSince}</Text>
          )}
        </View>
      </View>

      <View style={styles.stats}>
        <StatCard value="127" label="Articles lus" />
        <StatCard value="3" label="Championnats" />
        <StatCard value="3" label="Sauvegardés" />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Paramètres</Text>
      <SectionCard>
        <SettingRow
          icon={Bell}
          iconBgColor="#FF3B31"
          title="Notifications"
          subtitle="Courses et actualités"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          showSwitch
        />
        <SettingRow
          icon={Moon}
          iconBgColor="#FF9502"
          title="Mode sombre"
          subtitle={isDark ? "Activé" : "Désactivé"}
          value={isDark}
          onValueChange={(v) => setColorScheme(v ? "dark" : "light")}
          showSwitch
        />
        <SettingRow
          icon={Globe}
          iconBgColor="#31D158"
          title="Langue"
          subtitle="Français"
          showChevron
          isLast
        />
      </SectionCard>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Championnats suivis</Text>
      <SectionCard>
        {championshipsList.map((champ, index) => (
          <ChampionshipToggleRow
            key={champ.id}
            name={champ.name}
            color={champ.color}
            value={followedChampionships[champ.id] ?? false}
            onValueChange={() => toggleChampionship(champ.id)}
            isLast={index === championshipsList.length - 1}
          />
        ))}
      </SectionCard>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Articles sauvegardés{" "}
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>({savedArticles.length})</Text>
      </Text>
      <View style={styles.savedSection}>
        {savedArticles.map((article) => (
          <SavedArticleCard
            key={article.id}
            title={article.title}
            championship={article.championship}
            date={article.date}
          />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Autres</Text>
      <SectionCard>
        <SettingRow
          icon={Settings}
          title="Paramètres avancés"
          showChevron
        />
        <SettingRow
          icon={Info}
          title="À propos"
          showChevron
          isLast
        />
      </SectionCard>

      <View style={styles.bottomSpacer} />
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
