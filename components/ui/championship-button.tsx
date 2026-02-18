import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Championship {
  id: string;
  name: string;
  color?: string;
}

type Props = {
  champ: Championship;
  isSelected: boolean;
  onChampionshipChange: (id: string) => void;
};

export default function ChampionshipButton({
  champ,
  isSelected,
  onChampionshipChange,
}: Props) {
  return (
    <Pressable
      onPress={() => onChampionshipChange(champ.id)}
      style={[
        styles.button,
        isSelected ? { backgroundColor: champ.color } : styles.secondaryButton,
      ]}
    >
      <Text style={[styles.text, isSelected && styles.selectedText]}>
        {champ.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  secondaryButton: {
    backgroundColor: "#E5E5EA",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
