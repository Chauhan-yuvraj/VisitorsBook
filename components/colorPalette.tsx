import { View } from "react-native";
import React from "react";
import { Colors } from "@/data/Canvas";

export default function ColorPalette() {
  return (
    <View className="flex flex-row flex-wrap gap-2">
      {Colors.map((color) => (
        <View
          key={color}
          className={`w-12 h-12 rounded-lg border-white/ border`}
          style={{ backgroundColor: color }}
        />
      ))}
    </View>
  );
}