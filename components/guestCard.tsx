// components/guestCard.tsx
import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Guest } from "@/store/types/guest.type"; // Import the type

interface GuestCardProps {
  guest: Guest;
  onSelect: (guest: Guest) => void;
  isSelected: boolean; // Prop to highlight the selected card
}
export default function GuestCard({
  guest,
  onSelect,
  isSelected,
}: GuestCardProps) {
  const imageSource = { uri: guest.img };

  return (
    <TouchableOpacity onPress={() => onSelect(guest)}>
      <View
        className={`flex justify-center w-56 rounded-lg items-center gap-y-2 p-4 shadow-lg ${
          isSelected ? "border border-green-400" : ""
        }`}
      >
        <Image source={imageSource} className="w-48 h-48 rounded-xl" />
        <View className="bg-white w-full rounded-md">
          <Text className="text-lg font-semibold text-green-600 text-center">
            {guest.name}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            {guest.position}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
