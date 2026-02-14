import ChampionshipSelector from "@/components/ui/championship-selector";
import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <View style={styles.containerBox}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    paddingHorizontal: 20,
    paddingVertical: 80,
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
});
