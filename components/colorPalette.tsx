import { View, Pressable } from "react-native"; // Changed View to Pressable for interaction
import React from "react";
import { Colors } from "@/data/Canvas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setColor } from "@/store/slices/canvas.slice";

export default function ColorPalette() {
  const dispatch = useAppDispatch();
  const selectedColor = useAppSelector((state) => state.canvas.selectedColor);

  return (
    <View className="flex flex-row flex-wrap gap-2">
      {Colors.map((color) => {
        const isSelected = color === selectedColor;

        return (
          <Pressable
            key={color}
            // Use Pressable for interaction
            onPress={() => dispatch(setColor(color))}
          >
            <View
              className={`w-12 h-12 rounded-lg`}
              style={{ 
                backgroundColor: color,
                // Highlight the selected color with a thicker white border and shadow
                borderWidth: isSelected ? 4 : 1, 
                borderColor: isSelected ? 'white' : 'rgba(255, 255, 255, 0.3)',
                shadowColor: isSelected ? 'white' : 'transparent',
                shadowOpacity: isSelected ? 0.8 : 0,
                shadowRadius: isSelected ? 5 : 0,
                elevation: isSelected ? 5 : 0,
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}