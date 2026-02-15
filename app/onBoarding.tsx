import React from "react";
import { ImageBackground, Text, View } from "react-native";

export default function OnBoarding() {
  return (
    <View>
      <ImageBackground
        source={require("@/assets/images/onBoarding/background.jpg")}
        style={{ width: "100%", height: "100%" }}
      />
      <Text>onBoarding</Text>
    </View>
  );
}
