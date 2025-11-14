import { View, Text, Image } from "react-native";
import React from "react";
import { Guest } from "@/store/types/guest.type";

interface SelectGuestCardProps {
  guest: Guest;
}

export default function SelectGuestCard({ guest }: SelectGuestCardProps) {
  const imageSource = { uri: guest.img };

  return (
    <View className="bg-white rounded-2xl shadow-xl overflow-visible  max-w-sm  ">
      <View className="items-center mt-[-40]  flex flex-row">
        <View className="bg-white rounded-md p-1 shadow-lg">
          <Image
            source={imageSource}
            // Image styling
            className="w-48 h-48 rounded-md border-4 border-orange-500"
          />
        </View>
        {/* Position Badge */}
        <View>
          <View className="px-3 py-1 rounded-lg">
            <Text className="text-lg font-semibold text-green-500">
              {guest.position}
            </Text>
          </View>

          {/* Location */}
          <View className="mt-2">
            <Text className="text-base text-gray-700 ml-1">Ahmedabad</Text>
          </View>
        </View>
      </View>

      {/* 3. Details Section */}
      <View className="px-5">
        {/* Name */}
        <Text
          className="text-2xl font-extrabold text-gray-900 mb-1"
          numberOfLines={1} // Explicitly set 1 line
          ellipsizeMode="tail" // Ensure truncation happens at the end
        >
          {guest.name}
        </Text>
      </View>
    </View>
  );
}
