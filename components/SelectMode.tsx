import { View, Pressable, Text } from "react-native";
import React, { useState } from "react";
import { ClipboardType, Mic, SquarePen } from "lucide-react-native";
import { mode } from "@/data/Canvas"; // Assuming this exports: ['mic', 'text', 'canvas']

const iconMap: Record<string, React.ElementType> = {
  mic: Mic,
  text: ClipboardType,
  canvas: SquarePen,
};

export default function SelectMode() {
  // State to track the currently selected mode, default to the first item
  const [selectedTool, setSelectedTool] = useState<string>(mode[0]);

  if (!mode || mode.length === 0) {
    return (
      <Text className="text-red-500">Error: Mode data not available.</Text>
    );
  }

  // Determine the overall width needed based on the number of items
  const segmentWidthClass =
    mode.length === 3 ? "w-1/3" : mode.length === 2 ? "w-1/2" : "flex-1";

  return (
    // Outer container for the Segmented Control: White background, rounded corners, border
    <View className="flex flex-row overflow-hidden border border-gray-300 rounded-xl bg-gray-100">
      {mode.map((tool, index) => {
        const Icon = iconMap[tool];
        const isSelected = tool === selectedTool;
        const isLast = index === mode.length - 1;

        // Conditional Styling:
        // 1. Selected segment color/shadow
        const selectedStyle = isSelected
          ? "bg-green-500 shadow-md"
          : "bg-transparent";

        // 2. Border separating segments (only apply right border if it's NOT the last item)
        const borderStyle = isLast ? "" : "border-r border-gray-300";

        // 3. Icon color
        const iconColor = isSelected ? "#fff" : "#4b5563"; // White if selected, gray if not

        return (
          // Pressable for each segment
          <Pressable
            key={tool}
            className={`${segmentWidthClass} ${selectedStyle} ${borderStyle} p-3 items-center justify-center`}
            onPress={() => setSelectedTool(tool)}
            // Ensure border radius is not applied to individual segments
          >
            <Icon size={24} color={iconColor} />
            {/* Optional: Add a label below the icon */}
            <Text
              className={`text-xs mt-1 ${
                isSelected ? "text-white" : "text-gray-600"
              }`}
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
