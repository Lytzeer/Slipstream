import { CalendarRaceCard, ChampionshipSelector, CompletedRaceCard } from "@/components/ui";
import { useTheme } from "@/contexts/theme-context";
import { useAddRaceToCalendar } from "@/hooks/use-add-race-to-calendar";
import { useUpcomingRacesFeed } from "@/hooks/use-upcoming-races-feed";
import type { Championship, ChampionshipRaw } from "@/types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

const toChampionship = (raw: ChampionshipRaw): Championship => ({
  id: raw.id,
  name: raw.displayLabel ?? raw.linkValue ?? raw.id,
  color: raw.color,
});

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const [selectedChampionship, setSelectedChampionship] = useState<string>("all");

  const { upcomingRaces, pastRaces, isLoading } = useUpcomingRacesFeed(i18n.language);
  const { addRaceToCalendar } = useAddRaceToCalendar();

  const championships = useMemo(() => {
    const seen = new Set<string>();
    const list: Championship[] = [{ id: "all", name: t("common.all"), color: colors.primary }];
    for (const item of [...upcomingRaces, ...pastRaces]) {
      if (!seen.has(item.championship.id)) {
        seen.add(item.championship.id);
        list.push(toChampionship(item.championship));
      }
    }
    return list;
  }, [upcomingRaces, pastRaces, t, colors.primary]);

  const filteredUpcoming = selectedChampionship === "all"
    ? upcomingRaces
    : upcomingRaces.filter((item) => item.championship.id === selectedChampionship);

  const filteredPast = selectedChampionship === "all"
    ? pastRaces
    : pastRaces.filter((item) => item.championship.id === selectedChampionship);

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

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <>
          {filteredUpcoming.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("calendar.upcomingRaces")}
                </Text>
                <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
                  {t("calendar.racesCount", { count: filteredUpcoming.length })}
                </Text>
              </View>
              <View style={styles.list}>
                {filteredUpcoming.map((item, index) => (
                  <CalendarRaceCard
                    key={`${item.championship.id}-${item.race.circuit}-${index}`}
                    index={index}
                    name={item.race.name}
                    championship={toChampionship(item.championship)}
                    circuit={item.race.circuit}
                    country=""
                    date={item.race.date}
                    addLabel={t("calendar.add")}
                    onAdd={() => addRaceToCalendar(item)}
                  />
                ))}
              </View>
            </View>
          )}
          {filteredPast.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {t("calendar.completedRaces")}
                </Text>
                <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
                  {t("calendar.racesCount", { count: filteredPast.length })}
                </Text>
              </View>
              <View style={styles.list}>
                {filteredPast.map((item, index) => (
                  <CompletedRaceCard
                    key={`${item.championship.id}-${item.race.circuit}-${index}`}
                    index={index}
                    name={item.race.name}
                    championship={toChampionship(item.championship)}
                    circuit={item.race.circuit}
                    completedLabel={t("calendar.completed")}
                  />
                ))}
              </View>
            </View>
          )}
        </>
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
  loader: {
    marginTop: 60,
  },
});
