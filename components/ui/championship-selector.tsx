import { MotiView } from "moti";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

interface Championship {
  id: string;
  name: string;
  color?: string;
}

type Props = {
  championships: Championship[];
  selectedChampionship?: string | null;
  onChampionshipChange: (id: string) => void;
};

export default function ChampionshipSelector({
  championships,
  selectedChampionship,
  onChampionshipChange,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {championships.map((champ) => {
        const isSelected = selectedChampionship === champ.id;

        return (
          <MotiView
            key={champ.id}
            animate={{ scale: 1 }}
            transition={{ type: "timing" }}
          >
            <Pressable
              onPress={() => onChampionshipChange(champ.id)}
              style={[
                styles.button,
                isSelected
                  ? { backgroundColor: champ.color }
                  : styles.secondaryButton,
              ]}
            >
              <Text style={[styles.text, isSelected && styles.selectedText]}>
                {champ.name}
              </Text>
            </Pressable>
          </MotiView>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  secondaryButton: {
    backgroundColor: "#E5E7EB",
  },
  text: {
    color: "#111827",
    fontWeight: "600",
  },
  selectedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
