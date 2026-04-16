import {
  ChampionshipBadge,
  ChampionshipSelector,
  InfoCard,
  UpcomingRaceCard,
} from "@/components/ui";
import { colors as paletteColors } from "@/constants/theme";
import {
  type ChampionshipRaceFeedItem,
} from "@/lib/api/cms/controllers/championship.controller";
import { getChampionshipDisplayName } from "@/lib/api/cms/models/championship-label.model";
import { useChampionshipsCatalog } from "@/hooks/use-championships-catalog";
import { useUpcomingRacesFeed } from "@/hooks/use-upcoming-races-feed";
import { useTheme } from "@/contexts/theme-context";
import { ImageBackground } from "expo-image";
import { ChevronRight, Clock } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const {
    championships: championshipsRaw,
    error: championshipsError,
    isLoading: championshipsLoading,
  } = useChampionshipsCatalog();
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >("ELMS");

  const championshipsList = championshipsRaw.map((c) => ({
    id: c.id,
    name: getChampionshipDisplayName(c, t),
    color: c.color,
  }));

  const selectedChampionshipItem = useMemo(
    () => championshipsRaw.find((champ) => champ.id === selectedChampionship) ?? null,
    [championshipsRaw, selectedChampionship]
  );
  const {
    races: upcomingRaces,
    source: upcomingRacesSource,
    error: upcomingRacesError,
    isLoading: upcomingRacesLoading,
  } = useUpcomingRacesFeed(i18n.language);

  const selectedChampionshipRaces = useMemo<ChampionshipRaceFeedItem[]>(() => {
    if (!selectedChampionshipItem) return upcomingRaces;
    return upcomingRaces.filter((item) => item.championship.id === selectedChampionshipItem.id);
  }, [upcomingRaces, selectedChampionshipItem]);

  useEffect(() => {
    if (championshipsError || championshipsRaw.length === 0) return;
    if (
      !selectedChampionship ||
      !championshipsRaw.some((c) => c.id === selectedChampionship)
    ) {
      setSelectedChampionship(championshipsRaw[0].id);
    }
  }, [championshipsRaw, championshipsError, selectedChampionship]);

  return (
    <ScrollView
      style={[styles.containerBox, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollView}
    >
      <View id="titleSection">
        <Text style={[styles.title, { color: colors.text }]}>
          {t("common.appName")}
        </Text>
      </View>
      <View id="featuredContentSection">
        <View style={styles.featuredHeaderContent}>
          <Text style={[styles.featuredHeaderTitle, { color: colors.text }]}>
            {t("home.featured")}
          </Text>
          <View style={styles.featuredSeeAll}>
            <Text style={styles.featuredSeeAllText}>{t("common.seeAll")}</Text>
            <ChevronRight color="#FF3B31" size={20} />
          </View>
        </View>
        <ImageBackground
          source={require("../../assets/images/featured.png")}
          style={styles.featuredImage}
        >
          <ChampionshipBadge
            champ={{ id: "ELMS", name: t("championships.ELMS"), color: "#FF3B31" }}
          />
          <Text style={styles.featuredImageText}>
            {t("home.featuredArticle")}
          </Text>
          <View style={styles.featuredImageSubTextContainer}>
            <Clock color="white" size={14} />
            <Text style={styles.featuredImageSubText}>
              {t("home.readTime", { count: 8 })}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View id="lastActivitySection" style={{ marginTop: 40 }}>
        <Text style={[styles.featuredHeaderTitle, { color: colors.text }]}>
          {t("home.lastNews")}
        </Text>
        <InfoCard
          image={require("@/assets/images/info/info1.png")}
          category={t("home.article1Category")}
          title={t("home.article1Title")}
          readTime="12 min"
        />
        <InfoCard
          image={require("@/assets/images/info/info1.png")}
          category={t("home.article2Category")}
          title={t("home.article2Title")}
          readTime="6 min"
        />
      </View>
      <View id="upcomingRacesSection" style={{ marginTop: 40 }}>
        <Text style={[styles.featuredHeaderTitle, { color: colors.text }]}>
          {upcomingRacesSource === "past" ? "Courses passees" : t("home.upcomingRaces")}
        </Text>
        {championshipsLoading ? (
          <View style={styles.championshipsLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : championshipsError ? (
          <Text style={[styles.championshipsApiError, { color: paletteColors.error }]}>
            {t(championshipsError)}
          </Text>
        ) : (
          <>
            <View style={styles.championshipsFilterWrap}>
              <ChampionshipSelector
                championships={championshipsList}
                selectedChampionship={selectedChampionship}
                onChampionshipChange={setSelectedChampionship}
              />
            </View>
            {upcomingRacesLoading ? (
              <View style={styles.championshipsLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : upcomingRacesError ? (
              <Text style={[styles.championshipsApiError, { color: paletteColors.error }]}>
                {t(upcomingRacesError)}
              </Text>
            ) : upcomingRaces.length === 0 || !selectedChampionshipItem ? (
              <Text style={[styles.championshipsApiError, { color: colors.textMuted }]}>
                Aucune course disponible
              </Text>
            ) : (
              <View style={styles.racesSlidesContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.racesSlideRow}
                >
                  {selectedChampionshipRaces.map((race) => (
                    <View
                      key={`${race.championship.id}-${race.race.name}-${race.race.date}`}
                      style={styles.racesSlideCard}
                    >
                      <UpcomingRaceCard
                        championship={{
                          id: race.championship.id,
                          name: getChampionshipDisplayName(race.championship, t),
                          color: race.championship.color,
                        }}
                        race={race.race}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  featuredHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
  },
  featuredHeaderTitle: {
    fontWeight: "600",
    fontSize: 26,
  },
  featuredSeeAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredSeeAllText: {
    color: "#FF3B31",
    fontWeight: "600",
  },
  featuredImage: {
    width: "100%",
    height: 225,
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
    padding: 20,
    borderRadius: 16,
    overflow: "hidden",
    gap: 8,
  },
  featuredImageText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  featuredImageSubText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  featuredImageSubTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    opacity: 0.8,
  },
  championshipsLoading: {
    paddingVertical: 20,
    alignItems: "center",
  },
  championshipsApiError: {
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 16,
  },
  championshipsFilterWrap: {
    marginTop: 12,
  },
  racesSlidesContainer: {
    marginTop: 12,
    gap: 12,
  },
  racesSlideRow: {
    gap: 12,
    paddingRight: 8,
  },
  racesSlideCard: {
    width: 320,
  },
});
