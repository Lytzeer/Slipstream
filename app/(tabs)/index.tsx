import {
  ChampionshipBadge,
  ChampionshipSelector,
  InfoCard,
  UpcomingRaceCard,
} from "@/components/ui";
import { colors as paletteColors } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import { useArticlesFeed } from "@/hooks/use-articles-feed";
import { useChampionshipsCatalog } from "@/hooks/use-championships-catalog";
import { useUpcomingRacesFeed } from "@/hooks/use-upcoming-races-feed";
import { type ChampionshipRaceFeedItem } from "@/lib/api/cms/controllers/championship.controller";
import { getChampionshipDisplayName } from "@/lib/api/cms/models/championship-label.model";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { ChevronRight, Clock } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    () =>
      championshipsRaw.find((champ) => champ.id === selectedChampionship) ??
      null,
    [championshipsRaw, selectedChampionship],
  );
  const {
    upcomingRaces,
    error: upcomingRacesError,
    isLoading: upcomingRacesLoading,
  } = useUpcomingRacesFeed(i18n.language);

  const { articles, isLoading: articlesLoading } = useArticlesFeed(
    i18n.language,
  );
  const featuredArticle = useMemo(
    () => articles.find((a) => a.featured),
    [articles],
  );
  const latestArticles = useMemo(() => articles.slice(0, 2), [articles]);

  const selectedChampionshipRaces = useMemo<ChampionshipRaceFeedItem[]>(() => {
    if (!selectedChampionshipItem) return upcomingRaces;
    return upcomingRaces.filter(
      (item) => item.championship.id === selectedChampionshipItem.id,
    );
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
      <View id="titleSection" style={styles.titleSection}>
        <Image
          source={require("@/assets/images/02-horizontal-bold-black.png")}
          style={styles.logo}
          resizeMode="contain"
        />
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
        {articlesLoading ? (
          <View
            style={[
              styles.featuredImage,
              {
                backgroundColor: colors.surfaceAlt,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : featuredArticle ? (
          <Pressable
            onPress={() => router.push(`/article/${featuredArticle.id}`)}
          >
            <ImageBackground
              source={
                featuredArticle.imageUrl
                  ? { uri: featuredArticle.imageUrl }
                  : require("../../assets/images/featured.png")
              }
              style={styles.featuredImage}
            >
              <View style={styles.featuredOverlay}>
                {featuredArticle.championship && (
                  <ChampionshipBadge
                    champ={{
                      id: featuredArticle.championship.id,
                      name:
                        featuredArticle.championship.displayLabel ??
                        featuredArticle.championship.nameKey,
                      color: featuredArticle.championship.color,
                    }}
                  />
                )}
                <Text style={styles.featuredImageText}>
                  {featuredArticle.title}
                </Text>
                <View style={styles.featuredImageSubTextContainer}>
                  <Clock color="white" size={14} />
                  <Text style={styles.featuredImageSubText}>
                    {t("home.readTime", {
                      count: featuredArticle.readTimeMinutes,
                    })}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ) : null}
      </View>
      <View id="lastActivitySection" style={{ marginTop: 40 }}>
        <Text style={[styles.featuredHeaderTitle, { color: colors.text }]}>
          {t("home.lastNews")}
        </Text>
        {latestArticles.map((article) => (
          <InfoCard
            key={article.id}
            image={article.imageUrl ?? ""}
            category={article.category ?? ""}
            title={article.title}
            readTime={t("home.readTime", { count: article.readTimeMinutes })}
            onPress={() => router.push(`/article/${article.id}`)}
          />
        ))}
      </View>
      <View id="upcomingRacesSection" style={{ marginTop: 40 }}>
        <Text style={[styles.featuredHeaderTitle, { color: colors.text }]}>
          {t("home.upcomingRaces")}
        </Text>
        {championshipsLoading ? (
          <View style={styles.championshipsLoading}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : championshipsError ? (
          <Text
            style={[
              styles.championshipsApiError,
              { color: paletteColors.error },
            ]}
          >
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
              <Text
                style={[
                  styles.championshipsApiError,
                  { color: paletteColors.error },
                ]}
              >
                {t(upcomingRacesError)}
              </Text>
            ) : upcomingRaces.length === 0 || !selectedChampionshipItem ? (
              <Text
                style={[
                  styles.championshipsApiError,
                  { color: colors.textMuted },
                ]}
              >
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
                          name: getChampionshipDisplayName(
                            race.championship,
                            t,
                          ),
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
  titleSection: {
    paddingTop: 6,
    paddingBottom: 4,
    alignItems: "flex-start",
  },
  logo: {
    width: 280,
    height: 75,
  },
  featuredHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  featuredHeaderTitle: {
    fontWeight: "600",
    fontSize: 26,
  },
  featuredSeeAll: {
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
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
    gap: 8,
    justifyContent: "flex-end",
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
