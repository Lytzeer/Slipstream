import {
  ChampionshipBadge,
  ChampionshipSelector,
  InfoCard,
  UpcomingRaceCard,
} from "@/components/ui";
import { championshipsList as championshipsRaw } from "@/constants/mock-data";
import { useTheme } from "@/contexts/theme-context";
import { ImageBackground } from "expo-image";
import { ChevronRight, Clock } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >("ELMS");

  const championshipsList = championshipsRaw.map((c) => ({
    id: c.id,
    name: t(c.nameKey),
    color: c.color,
  }));

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
      <ChampionshipSelector
        championships={championshipsList}
        selectedChampionship={selectedChampionship}
        onChampionshipChange={setSelectedChampionship}
      />
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
          {t("home.upcomingRaces")}
        </Text>
        <UpcomingRaceCard
          championship={{ id: "ELMS", name: t("championships.ELMS"), color: "#FF3B31" }}
          race={{
            name: t("home.race1Name"),
            date: t("home.race1Date"),
            circuit: t("home.race1Circuit"),
          }}
        />
        <UpcomingRaceCard
          championship={{ id: "ELMS", name: t("championships.ELMS"), color: "#FF3B31" }}
          race={{
            name: t("home.race2Name"),
            date: t("home.race2Date"),
            circuit: t("home.race2Circuit"),
          }}
        />
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
});
