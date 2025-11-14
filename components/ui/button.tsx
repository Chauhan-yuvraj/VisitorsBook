import React from "react";
import { Button } from "react-native-paper";
import { PressableProps } from "react-native";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export default function ButtonUI({ text, onPress }: ButtonProps) {
  return (
    <Button
      mode="contained"
      buttonColor="#10b981" // Equivalent to Tailwind's green-500
      textColor="#ffffff" // White text
      style={{
        borderRadius: 8,
        paddingVertical: 4,
        elevation: 5,
      }}
      labelStyle={{
        fontSize: 16,
        fontWeight: "600", // Semi-bold text
      }}
      onPress={onPress}
    >
      {text}
    </Button>
  );
}
