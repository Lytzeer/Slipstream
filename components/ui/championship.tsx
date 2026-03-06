import { useTheme } from "@/contexts/theme-context";
import { MotiView } from "moti";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import type { Championship as ChampionshipType } from "@/types";

type Champ = { id: string; name: string; color?: string };

// ChampionshipBadge
export default function ChampionshipBadge({
  champ,
}: {
  champ: ChampionshipType;
}) {
  return (
    <View style={[champStyles.badge, { backgroundColor: champ.color }]}>
      <Text style={champStyles.badgeText}>{champ.name}</Text>
    </View>
  );
}

// ChampionshipButton
function ChampionshipButton({
  champ,
  isSelected,
  onChampionshipChange,
}: {
  champ: Champ;
  isSelected: boolean;
  onChampionshipChange: (id: string) => void;
}) {
  const { colors } = useTheme();
  const bg = isSelected ? champ.color : colors.surfaceAlt;
  const textColor = isSelected ? "#fff" : colors.text;

  return (
    <Pressable
      onPress={() => onChampionshipChange(champ.id)}
      style={[champStyles.button, { backgroundColor: bg }]}
    >
      <Text style={[champStyles.buttonText, { color: textColor }]}>{champ.name}</Text>
    </Pressable>
  );
}

// ChampionshipSelector
export function ChampionshipSelector({
  championships,
  selectedChampionship,
  onChampionshipChange,
}: {
  championships: Champ[];
  selectedChampionship?: string | null;
  onChampionshipChange: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={champStyles.selector}
    >
      {championships.map((champ) => (
        <MotiView
          key={champ.id}
          animate={{ scale: 1 }}
          transition={{ type: "timing" }}
        >
          <ChampionshipButton
            champ={champ}
            isSelected={selectedChampionship === champ.id}
            onChampionshipChange={onChampionshipChange}
          />
        </MotiView>
      ))}
    </ScrollView>
  );
}

// ChampionshipToggleRow
export const ChampionshipToggleRow = ({
  name,
  color,
  value,
  onValueChange,
  isLast = false,
}: {
  name: string;
  color: string;
  value: boolean;
  onValueChange: () => void;
  isLast?: boolean;
}) => {
  const { colors } = useTheme();
  const rowStyle = [
    champStyles.row,
    { borderBottomColor: colors.border },
    isLast && champStyles.rowLast,
  ];
  return (
    <View style={rowStyle}>
      <View style={[champStyles.dot, { backgroundColor: color }]} />
      <Text style={[champStyles.name, { color: colors.text }]}>{name}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
};

const champStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: { color: "white", fontWeight: "500" },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  buttonText: { fontWeight: "bold" },
  selector: { gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { flex: 1, fontSize: 16, fontWeight: "500" },
});
