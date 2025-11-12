// components/guestCard.tsx
import { Image, Text, View } from "react-native";
import React from "react";
import { Guest } from "@/store/types/guest.type"; // Import the type

interface GuestCardProps {
  guest: Guest;
}

export default function GuestCard({ guest }: GuestCardProps) {
  // Determine the image source (Note: If 'img' holds a local path, you need proper resolution logic)
  // For simplicity, we assume 'img' is a remote URL here, or we use a static fallback.
  const imageSource = { uri: guest.img };
  // If you need to handle local images from a path:
  // const imageSource = guest.img.startsWith('@/') ? require(guest.img) : { uri: guest.img };

  return (
    <View className="flex justify-center rounded-lg items-center gap-y-2 bg-white p-4 w-40 h-60 shadow-lg">
      <Image
        source={imageSource}
        className="w-24 h-24 rounded-full border-2 border-green-500"
      />
      <Text className="text-base font-semibold text-green-600 text-center">
        {guest.name}
      </Text>
      <Text className="text-sm text-gray-500 text-center">
        {guest.position}
      </Text>
    </View>
  );
}
