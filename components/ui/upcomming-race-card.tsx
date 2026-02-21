import ChampionshipBadge from "@/components/ui/championship-badge";
import Championship from "@/types/Championship";
import Race from "@/types/Race";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type UpcomingRaceCardProps = {
  championship: Championship;
  race: Race;
};

export default function UpcomingRaceCard({
  championship,
  race,
}: UpcomingRaceCardProps) {
  return (
    <Pressable style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftContent}>
          <ChampionshipBadge champ={championship} />
          <Text style={styles.raceName}>{race.name}</Text>
          <Text style={styles.circuit}>{race.circuit}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.date}>{race.date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftContent: {
    flex: 1,
    gap: 12,
  },
  raceName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  circuit: {
    fontSize: 14,
    color: "#8E8E93",
  },
  rightContent: {
    marginLeft: 12,
  },
  date: {
    fontSize: 14,
    color: "#FF3B31",
    textAlign: "right",
  },
});
