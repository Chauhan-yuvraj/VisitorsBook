import { View, Text, Pressable } from "react-native";
import React from "react";

interface ButtonsProps {
  text: string;
  onClick: () => void;
}

export default function Buttons({ text, onClick }: ButtonsProps) {
  return (
    <View className="">
      <Pressable
        className="px-12 py-4 border border-[#555] rounded-full active:bg-black/10 "
        onPress={onClick}
      >
        <Text className="text-black text-center text-lg">{text}</Text>
      </Pressable>
    </View>
  );
}
