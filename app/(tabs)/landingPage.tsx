import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { House, Settings } from "lucide-react-native";
import Background from "@/components/ui/background";

export default function LandingPage() {
  return (
    <Background image={require("@/assets/images/bg2.jpg")}>
      {/* Top buttons */}
      <View className="absolute top-[2%] right-[2%] flex-row gap-x-2">
        <Pressable
          onPress={() => router.push("/")}
          className="bg-gray-400 rounded-xl p-2"
        >
          <House color="white" />
        </Pressable>
        <Pressable
          onPress={() => router.push("/loginPage")}
          className="bg-gray-400 rounded-xl p-2"
        >
          <Settings color="white" />
        </Pressable>
      </View>

      {/* Foreground content */}
      <View className="flex-1 justify-center items-center gap-y-24">
        <Image
          source={require("@/assets/images/icon.png")}
          className="w-32 h-32"
          resizeMode="cover"
        />

        <View className="flex flex-row gap-x-4">
          <Text className="text-5xl font-bold text-orange-600">DIGITAL </Text>
          <Text className="text-5xl font-bold text-white">VISITORS </Text>
          <Text className="text-5xl font-bold text-green-500">BOOK</Text>
        </View>

        <Pressable
          onPress={() => router.push("/(guest)/selectGuest")}
          className="border border-green-500 bg-green-500 px-8 py-4 rounded-sm"
        >
          <Text className="text-white text-xl font-semibold uppercase text-center">
            Visitors
          </Text>
        </Pressable>
      </View>
    </Background>
  );
}
