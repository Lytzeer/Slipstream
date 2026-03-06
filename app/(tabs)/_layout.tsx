import React from "react";

import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf="paperplane.fill" drawable="custom_settings_drawable" />
        <Label>Explore</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" drawable="custom_settings_drawable" />
        <Label>Profil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
