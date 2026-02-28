import ChampionshipBadge from "@/components/ui/championship-badge";
import ChampionshipSelector from "@/components/ui/championship-selector";
import InfoCard from "@/components/ui/info-card";
import UpcomingRaceCard from "@/components/ui/upcomming-race-card";
import { ImageBackground } from "expo-image";
import { ChevronRight, Clock } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >("ELMS");

  const championshipsList = [
    { id: "ELMS", name: "ELMS", color: "#FF3B31" },
    { id: "LMC", name: "Le Mans Cup", color: "#FF9502" },
    { id: "GTWORLD", name: "GT World", color: "#31D158" },
  ];

  return (
    <ScrollView
      style={styles.containerBox}
      contentContainerStyle={styles.scrollView}
    >
      <View id="titleSection">
        <Text style={styles.title}>Slipstream</Text>
      </View>
      <ChampionshipSelector
        championships={championshipsList}
        selectedChampionship={selectedChampionship}
        onChampionshipChange={setSelectedChampionship}
      />
      <View id="featuredContentSection">
        <View style={styles.featuredHeaderContent}>
          <Text style={styles.featuredHeaderTitle}>À la une</Text>
          <View style={styles.featuredSeeAll}>
            <Text style={styles.featuredSeeAllText}>Voir tout</Text>
            <ChevronRight color="#FF3B31" size={20} />
          </View>
        </View>
        <ImageBackground
          source={require("../../assets/images/featured.png")}
          style={styles.featuredImage}
        >
          <ChampionshipBadge
            champ={{ id: "ELMS", name: "ELMS", color: "#FF3B31" }}
          />
          <Text style={styles.featuredImageText}>
            Retour sur la victoire historique aux 24h du Mans
          </Text>
          <View style={styles.featuredImageSubTextContainer}>
            <Clock color="white" size={14} />
            <Text style={styles.featuredImageSubText}>8 min de lecture</Text>
          </View>
        </ImageBackground>
      </View>
      <View id="lastActivitySection" style={{ marginTop: 40 }}>
        <Text style={styles.featuredHeaderTitle}>Dernières actualités</Text>
        <InfoCard
          image={require("@/assets/images/info/info1.png")}
          category="Analyse"
          title="Analyse technique : Les secrets de la Ferrari 499P"
          readTime="12 min"
        />
        <InfoCard
          image={require("@/assets/images/info/info1.png")}
          category="Le Mans Cup"
          title="Prochaine course à Monza : Preview et favoris"
          readTime="6 min"
        />
      </View>
      <View id="upcomingRacesSection" style={{ marginTop: 40 }}>
        <Text style={styles.featuredHeaderTitle}>Prochaines courses</Text>
        <UpcomingRaceCard
          championship={{ id: "ELMS", name: "ELMS", color: "#FF3B31" }}
          race={{
            name: "4 Heures du Castellet",
            date: "03 Mai 2026",
            circuit: "Circuit Paul Ricard",
          }}
        />
        <UpcomingRaceCard
          championship={{ id: "ELMS", name: "ELMS", color: "#FF3B31" }}
          race={{
            name: "4 Heures d'Imola",
            date: "05 Juillet 2026",
            circuit: "Autodromo Enzo e Dino Ferrari",
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
