import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import Background from "@/components/ui/background";

export default function Options() {
  return (
    <Background image={require("@/assets/images/bg2.jpg")} overlayOpacity={0.6}>
      <View className="w-full h-full justify-center items-center flex flex-row gap-x-11">
        <Pressable className="border p-4 bg-orange-100/30 rounded-md" onPress={() => router.push("/(admin)/CreateGuest")}>
          <Text className="text-white text-4xl font-bold ">Create Guest</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(admin)/records")} className="border p-4 bg-blue-400/30 rounded-md">
          <Text className="text-white text-4xl font-bold ">Guest Records</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(admin)/Setting")} className="border p-4 bg-green-400/30 rounded-md">
          <Text className="text-white text-4xl font-bold ">Settings</Text>
        </Pressable>
      </View>
    </Background>
  );
}
