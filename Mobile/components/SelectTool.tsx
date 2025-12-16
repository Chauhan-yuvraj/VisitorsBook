import { View } from "react-native";
import React from "react";
import { IconButton } from "react-native-paper";
import { tools } from "@/data/Canvas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTool } from "@/store/slices/canvas.slice";

import { Pen, Eraser, RotateCw, Trash2, RotateCcw } from "lucide-react-native";

const LucideIconMap: Record<string, React.ElementType> = {
  pen: Pen,
  eraser: Eraser,
  undo: RotateCcw,
  redu: RotateCw,
  clear: Trash2,
};

// Define Props Interface for SelectTool
interface SelectToolProps {
  onUndo: () => void;
  onClear: () => void;
  onRedo: () => void; // New prop for Redo
}

// Update the component signature to accept props
export default function SelectTool({
  onUndo,
  onClear,
  onRedo,
}: SelectToolProps) {
  const dispatch = useAppDispatch();
  const selectedTool = useAppSelector((state) => state.canvas.selectedTool);

  // Function to handle the actual button press logic
  const handlePress = (tool: string) => {
    // 1. Check for utility actions (Undo, Clear, Redo)
    if (tool === "undo") {
      onUndo();
    } else if (tool === "clear") {
      onClear();
    } else if (tool === "redu") {
      onRedo();
    } else {
      // 2. If it's a primary tool (pen, eraser, etc.), dispatch the change
      dispatch(setTool(tool));
    }
  };

  return (
    <View className="flex flex-row flex-wrap gap-2">
      {tools.map((tool) => {
        const IconComponent = LucideIconMap[tool];
        if (!IconComponent) return null;

        const isPrimaryTool =
          tool !== "undo" && tool !== "clear" && tool !== "redu";
        const isSelected = isPrimaryTool && tool === selectedTool;

        // Use different styling for utility buttons (less prominent selection)
        const isUtility = !isPrimaryTool;

        // Define colors based on selection/utility
        const iconColor = isSelected ? "#000000" : isUtility ? "#00000080" : "#00000080"; // White, gray (utility), or Black
        const borderColor = isSelected
          ? "#047857"
          : isUtility
          ? "#d1d5db"
          : "#d1d5db";

        return (
          <IconButton
            key={tool}
            size={24}
            icon={() => <IconComponent size={24} color={iconColor} />}
            containerColor={"#FFFFFF80"}
            iconColor={iconColor}
            rippleColor="rgba(0, 0, 0, 0.1)"
            onPress={() => handlePress(tool)} // Use the new handler
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: borderColor,
              elevation: isSelected ? 4 : isUtility ? 1 : 0,
            }}
          />
        );
      })}
    </View>
  );
}
