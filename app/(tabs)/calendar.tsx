import { CalendarRaceCard, ChampionshipSelector, CompletedRaceCard } from "@/components/ui";
import { calendarRaces, championshipsList } from "@/constants/mock-data";
import { useTheme } from "@/contexts/theme-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedChampionship, setSelectedChampionship] = useState<string>("all");

  const championships = [
    { id: "all", name: t("common.all"), color: colors.primary },
    ...championshipsList.map((c) => ({
      id: c.id,
      name: t(c.nameKey),
      color: c.color,
    })),
  ];

  const filtered = selectedChampionship === "all"
    ? calendarRaces
    : calendarRaces.filter((r) => r.championshipId === selectedChampionship);

  const upcoming = filtered.filter((r) => !r.completed);
  const completed = filtered.filter((r) => r.completed);

  const getChampionship = (id: string) => {
    const raw = championshipsList.find((c) => c.id === id);
    return { id, name: t(raw?.nameKey ?? ""), color: raw?.color ?? "#888" };
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t("calendar.title")}
      </Text>

      <ChampionshipSelector
        championships={championships}
        selectedChampionship={selectedChampionship}
        onChampionshipChange={setSelectedChampionship}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("calendar.upcomingRaces")}
          </Text>
          <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
            {t("calendar.racesCount", { count: upcoming.length })}
          </Text>
        </View>
        <View style={styles.list}>
          {upcoming.map((race, index) => (
            <CalendarRaceCard
              key={race.id}
              index={index}
              name={t(race.nameKey)}
              championship={getChampionship(race.championshipId)}
              circuit={t(race.circuitKey)}
              country={race.country}
              date={race.date}
              addLabel={t("calendar.add")}
            />
          ))}
        </View>
      </View>

      {completed.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("calendar.completedRaces")}
            </Text>
            <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
              {t("calendar.racesCount", { count: completed.length })}
            </Text>
          </View>
          <View style={styles.list}>
            {completed.map((race, index) => (
              <CompletedRaceCard
                key={race.id}
                index={index}
                name={t(race.nameKey)}
                championship={getChampionship(race.championshipId)}
                circuit={t(race.circuitKey)}
                completedLabel={t("calendar.completed")}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  sectionCount: {
    fontSize: 13,
  },
  list: {
    gap: 12,
  },
});
