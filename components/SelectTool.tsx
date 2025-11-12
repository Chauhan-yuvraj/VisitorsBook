import { View, Pressable } from "react-native";
import React from "react";
import { Pen, Eraser, RotateCw, Trash2, RotateCcw } from "lucide-react-native";
import { tools } from "@/data/Canvas";

const iconMap: Record<string, React.ElementType> = {
  pen: Pen,
  eraser: Eraser,
  undo: RotateCw,
  redu: RotateCcw,
  clear: Trash2,
};

export default function SelectTool() {
  return (
    <View className="flex flex-row flex-wrap gap-4">
      {tools.map((tool) => {
        const Icon = iconMap[tool];
        return (
          <Pressable
            key={tool}
            className="bg-gray-200 p-3 rounded-lg"
            onPress={() => console.log(tool)}
          >
            <Icon size={24} color="#000" />
          </Pressable>
        );
      })}
    </View>
  );
}
