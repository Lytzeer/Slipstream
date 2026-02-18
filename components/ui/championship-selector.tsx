import { MotiView } from "moti";
import { ScrollView, StyleSheet } from "react-native";
import ChampionshipButton from "./championship-button";

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
            <ChampionshipButton
              champ={champ}
              isSelected={isSelected}
              onChampionshipChange={onChampionshipChange}
            />
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
});
