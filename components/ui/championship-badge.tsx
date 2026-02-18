import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChampionshipBadge({ champ }: any) {
  return (
    <View style={[style.badgeContainer, { backgroundColor: champ.color }]}>
      <Text style={style.badgeText}>{champ.name}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontWeight: "500",
  },
});
