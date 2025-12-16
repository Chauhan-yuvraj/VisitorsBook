import { View, Text } from "react-native";
import React from "react";
// Import the RNP component
import { SegmentedButtons } from "react-native-paper";
import { ClipboardType, Mic, SquarePen } from "lucide-react-native";
import { mode } from "@/data/Canvas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMode } from "@/store/slices/canvas.slice";

// Map tool names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  mic: Mic,
  text: ClipboardType,
  canvas: SquarePen,
};

export default function SelectMode() {
  const dispatch = useAppDispatch();
  const selectedMode = useAppSelector((state) => state.canvas.selectedMode);

  if (!mode || mode.length === 0) {
    return (
      <Text className="text-red-500">Error: Mode data not available.</Text>
    );
  }

  const buttons = mode.map((tool) => ({
    value: tool,
    label: tool.charAt(0).toUpperCase() + tool.slice(1),
    icon: ({ color }: { color: string }) => {
      const IconComponent = iconMap[tool];
      if (!IconComponent) return null;
      return <IconComponent size={24} color={color} />;
    },
    style: { flex: 1 },
  }));

  return (
    <View>
      <SegmentedButtons
        value={selectedMode}
        onValueChange={(value) => dispatch(setMode(value))}
        buttons={buttons}
        // Customize appearance (Optional, RNP defaults look good)
        style={{ backgroundColor: "#FFFFFF40", borderRadius: 24 }}
        theme={{
          colors: {
            secondaryContainer: "#00000080", 
            onSurface: "#555", 
            onSecondaryContainer: "#FFFFFF",
          },
        }}
      />
    </View>
  );
}
