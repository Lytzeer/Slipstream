import { useTheme } from "@/contexts/theme-context";
import type { Championship, Race } from "@/types";
import { Image } from "expo-image";
import { Bookmark, CalendarDays, Clock, MapPin, Plus } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ChampionshipBadge from "./championship";

// InfoCard
type InfoCardProps = {
  image: string;
  category: string;
  title: string;
  readTime: string;
  onPress?: () => void;
};

export default function InfoCard({
  image,
  category,
  title,
  readTime,
  onPress,
}: InfoCardProps) {
  const { colors } = useTheme();
  const themed = {
    container: { backgroundColor: colors.surface, borderColor: colors.border },
    badge: { backgroundColor: colors.surfaceAlt },
    text: { color: colors.text },
    muted: { color: colors.textSecondary },
    meta: { color: colors.textMuted },
  };

  return (
    <Pressable
      style={[cardStyles.container, themed.container]}
      onPress={onPress}
    >
      <View style={cardStyles.imageWrapper}>
        <Image source={image} style={cardStyles.image} contentFit="cover" />
      </View>
      <View style={cardStyles.content}>
        <View>
          <View style={[cardStyles.badge, themed.badge]}>
            <Text style={[cardStyles.badgeText, themed.muted]}>{category}</Text>
          </View>
          <Text style={[cardStyles.title, themed.text]} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={cardStyles.meta}>
          <Clock color={colors.textMuted} size={12} />
          <Text style={[cardStyles.metaText, themed.meta]}>{readTime}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// SavedArticleCard
type SavedArticleCardProps = {
  title: string;
  championship: string;
  date: string;
};

export const SavedArticleCard = ({
  title,
  championship,
  date,
}: SavedArticleCardProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        cardStyles.savedCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Bookmark size={20} color={colors.primary} fill={colors.primary} />
      <View style={cardStyles.savedContent}>
        <Text
          style={[cardStyles.savedTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text style={[cardStyles.savedMeta, { color: colors.primary }]}>
          {championship} • {date}
        </Text>
      </View>
    </View>
  );
};

// SectionCard
type SectionCardProps = { children: React.ReactNode };

export const SectionCard = ({ children }: SectionCardProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        cardStyles.sectionCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {children}
    </View>
  );
};

// StatCard
type StatCardProps = {
  value: string | number;
  label: string;
  color?: string;
};

export const StatCard = ({ value, label, color }: StatCardProps) => {
  const { colors } = useTheme();
  const valueColor = color ?? colors.text;
  return (
    <View
      style={[
        cardStyles.statCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[cardStyles.statValue, { color: valueColor }]}>{value}</Text>
      <Text
        style={[cardStyles.statLabel, { color: colors.textMuted }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );
};

// UpcomingRaceCard
type UpcomingRaceCardProps = {
  championship: Championship;
  race: Race;
};

export function UpcomingRaceCard({
  championship,
  race,
}: UpcomingRaceCardProps) {
  const { colors } = useTheme();
  const themed = {
    container: { backgroundColor: colors.surface, borderColor: colors.border },
    text: { color: colors.text },
    muted: { color: colors.textMuted },
    primary: { color: colors.primary },
  };

  return (
    <Pressable style={[cardStyles.upcomingContainer, themed.container]}>
      <View style={cardStyles.upcomingRow}>
        <View style={cardStyles.upcomingLeft}>
          <ChampionshipBadge champ={championship} />
          <Text style={[cardStyles.raceName, themed.text]}>{race.name}</Text>
          <Text style={[cardStyles.circuit, themed.muted]}>{race.circuit}</Text>
        </View>
        <View style={cardStyles.upcomingRight}>
          <Text style={[cardStyles.date, themed.primary]}>{race.date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

// CalendarRaceCard
type CalendarRaceCardProps = {
  name: string;
  championship: Championship;
  circuit: string;
  country: string;
  date: string;
  index: number;
  addLabel: string;
};

export function CalendarRaceCard({
  name,
  championship,
  circuit,
  country,
  date,
  index,
  addLabel,
}: CalendarRaceCardProps) {
  const { colors } = useTheme();
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 300, delay: index * 50 }}
    >
      <View style={[cardStyles.calendarCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={cardStyles.calendarCardHeader}>
          <View style={[cardStyles.champBadge, { backgroundColor: championship.color }]}>
            <Text style={cardStyles.champBadgeText}>{championship.name}</Text>
          </View>
          <Pressable style={[cardStyles.addButton, { borderColor: colors.border }]}>
            <Plus size={14} color={colors.text} />
            <Text style={[cardStyles.addButtonText, { color: colors.text }]}>{addLabel}</Text>
          </Pressable>
        </View>
        <Text style={[cardStyles.calendarRaceName, { color: colors.text }]}>{name}</Text>
        <View style={cardStyles.calendarMeta}>
          <View style={cardStyles.calendarMetaRow}>
            <MapPin size={14} color={colors.textMuted} />
            <Text style={[cardStyles.calendarMetaText, { color: colors.textMuted }]}>{circuit}, {country}</Text>
          </View>
          <View style={cardStyles.calendarMetaRow}>
            <CalendarDays size={14} color={colors.textMuted} />
            <Text style={[cardStyles.calendarMetaText, { color: colors.textMuted }]}>{date}</Text>
          </View>

        </View>
      </View>
    </MotiView>
  );
}

// CompletedRaceCard
type CompletedRaceCardProps = {
  name: string;
  championship: Championship;
  circuit: string;
  index: number;
  completedLabel: string;
};

export function CompletedRaceCard({
  name,
  championship,
  circuit,
  index,
  completedLabel,
}: CompletedRaceCardProps) {
  const { colors } = useTheme();
  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 300, delay: index * 50 }}
      style={{ opacity: 0.6 }}
    >
      <View style={[cardStyles.completedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={cardStyles.calendarCardHeader}>
          <View style={[cardStyles.champBadge, { backgroundColor: colors.surfaceAlt }]}>
            <Text style={[cardStyles.champBadgeText, { color: colors.textMuted }]}>{championship.name}</Text>
          </View>
          <View style={[cardStyles.completedBadge, { borderColor: colors.textMuted }]}>
            <Text style={[cardStyles.completedBadgeText, { color: colors.textMuted }]}>{completedLabel}</Text>
          </View>
        </View>
        <Text style={[cardStyles.calendarRaceName, { color: colors.text, fontSize: 15 }]}>{name}</Text>
        <View style={cardStyles.calendarMetaRow}>
          <MapPin size={14} color={colors.textMuted} />
          <Text style={[cardStyles.calendarMetaText, { color: colors.textMuted }]}>{circuit}</Text>
        </View>
      </View>
    </MotiView>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
  },
  imageWrapper: { width: 112, height: 112, flexShrink: 0 },
  image: { width: "100%", height: "100%" },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginBottom: 6,
  },
  badgeText: { fontSize: 11, fontWeight: "500" },
  title: { fontSize: 14, lineHeight: 18 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  metaText: { fontSize: 12 },
  savedCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  savedContent: { flex: 1 },
  savedTitle: { fontSize: 15, fontWeight: "500", lineHeight: 20 },
  savedMeta: { fontSize: 13, marginTop: 4 },
  sectionCard: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  statValue: { fontSize: 28 },
  statLabel: { fontSize: 12, marginTop: 4, textAlign: "center" },
  upcomingContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
  },
  upcomingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  upcomingLeft: { flex: 1, gap: 12 },
  raceName: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  circuit: { fontSize: 14 },
  upcomingRight: { marginLeft: 12 },
  date: { fontSize: 14, textAlign: "right" },
  calendarCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  calendarCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  champBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  champBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  addButtonText: {
    fontSize: 12,
  },
  calendarRaceName: {
    fontSize: 17,
    fontWeight: "600",
  },
  calendarMeta: {
    gap: 6,
  },
  calendarMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  calendarMetaText: {
    fontSize: 13,
  },
  completedCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  completedBadgeText: {
    fontSize: 11,
  },
});
