import { View, Text, Image } from "react-native";
import React from "react";
import { Guest } from "@/store/types/guest.type";

interface SelectGuestCardProps {
  guest: Guest;
}

export default function SelectGuestCard({ guest }: SelectGuestCardProps) {
  const imageSource = { uri: guest.img };

  return (
    <View className="bg-white rounded-2xl shadow-xl overflow-visible  max-w-sm">
      <View className="items-center mt-[-40] mb-4">
        <View className="bg-white rounded-full p-1 shadow-lg">
          <Image
            source={imageSource}
            // Image styling
            className="w-48 h-48 rounded-full border-4 border-orange-500"
          />
        </View>
      </View>

      {/* 3. Details Section */}
      <View className="px-6 pb-6 items-center">
        {/* Name */}
        <Text className="text-3xl font-extrabold text-gray-900 mb-1 text-center">
          {guest.name}
        </Text>

        {/* Position Badge */}
        <View className="flex-row items-center px-3 py-1 rounded-lg bg-green-500">
          <Text className="text-lg font-semibold text-white  text-center">
            {guest.position}
          </Text>
        </View>

        {/* Location */}
        <View className="flex-row items-center mt-2">
          <Text className="text-base text-gray-700 ml-1">Ahmedabad, India</Text>
        </View>
      </View>
    </View>
  );
}
