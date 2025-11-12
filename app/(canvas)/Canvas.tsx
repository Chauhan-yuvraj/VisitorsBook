import { Text, View } from "react-native";
import React from "react";
import { useAppSelector } from "@/store/hooks";
import Background from "@/components/ui/background";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectGuestCard from "@/components/SelectGuestCard";
import ColorPalette from "@/components/colorPalette";
import SelectTool from "@/components/SelectTool";
import SelectMode from "@/components/SelectMode";

export default function Canvas() {
  const { selectedGuest } = useAppSelector((state) => state.guest);

  const guest = selectedGuest || {
    name: "No Guest Selected",
    position: "Tap a guest to select",
    img: "https://via.placeholder.com/150",
  };

  return (
    <Background image={require("@/assets/images/background.jpg")}>
      <SafeAreaView className="flex-1 p-6">
        {/* Horizontal layout with 1:3 ratio */}
        <View className="flex-1 flex-row gap-4">
          {/* Left Column (1 part - Card + Color Palette) */}
          <View className="flex-1 gap-y-6 ">
            <View>
              <SelectGuestCard guest={guest} />
            </View>
            <View className="bg-white/10 p-1 rounded-lg">
              <ColorPalette />
            </View>
            <View className="bg-white/10 p-1 rounded-lg">
              <SelectTool />
            </View>
            <View className="">
              <SelectMode />
            </View>
          </View>

          {/* Right Column (3 parts - Big Box) */}
          <View className="flex-[3] bg-white/10 rounded-2xl p-6 border border-white/20">
            <Text className="text-white text-2xl font-bold mb-2">
              Canvas Area
            </Text>
            <Text className="text-white/70 text-base">
              This is your main content area (3x larger than left column)
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}
