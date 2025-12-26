import ChampionshipSelector from "@/components/ui/championship-selector";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >("ELMS");

  const championshipsList = [
    { id: "ELMS", name: "ELMS", color: "#FF3B31" },
    { id: "LMC", name: "Le Mans Cup", color: "#FF9502" },
    { id: "GTWORLD", name: "GT World Challenge", color: "#31D158" },
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
    </View>
  );
}

const styles = StyleSheet.create({
  containerBox: {
    paddingHorizontal: 20,
    paddingVertical: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
  },
});
