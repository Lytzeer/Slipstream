import Input from "@/components/ui/input";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  inputTitle: string;
  placeholder: string;
  isPassword?: boolean;
  leftIcon?: LucideIcon;
};

export default function InputSection({
  inputTitle,
  placeholder,
  isPassword,
  leftIcon,
}: Props) {
  return (
    <View style={styles.inputSectionContainer}>
      <Text style={styles.inputTitle}>{inputTitle}</Text>
      <Input
        placeholder={placeholder}
        isPassword={isPassword}
        leftIcon={leftIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputSectionContainer: {
    width: "100%",
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
});
