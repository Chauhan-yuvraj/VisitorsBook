import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { User, Camera } from "lucide-react-native";

interface ImageUploadProps {
  imageUri: string | null;
  onPress: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUri, onPress }) => {
  return (
    <View className="items-center mb-8">
      <TouchableOpacity onPress={onPress} className="relative">
        <View className="h-28 w-28 rounded-full bg-gray-100 border-4 border-white shadow-sm items-center justify-center overflow-hidden">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <User size={40} color="#9CA3AF" />
          )}
        </View>
        <View className="absolute bottom-0 right-0 bg-blue-600 h-9 w-9 rounded-full items-center justify-center border-2 border-white shadow-sm">
          <Camera size={16} color="white" />
        </View>
      </TouchableOpacity>
      <Text className="text-xs text-gray-500 mt-3">
        Tap to upload profile photo
      </Text>
    </View>
  );
};
