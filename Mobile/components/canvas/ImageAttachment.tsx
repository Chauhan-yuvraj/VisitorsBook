import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';

interface ImageAttachmentProps {
  imageUris: string[];
  setImageUris: (uris: string[]) => void;
  handleTakePhoto: () => void;
  handleChooseFromGallery: () => void;
}

export function ImageAttachment({
  imageUris,
  setImageUris,
  handleTakePhoto,
  handleChooseFromGallery
}: ImageAttachmentProps) {

  const removeImage = (indexToRemove: number) => {
    setImageUris(imageUris.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <Text className="text-lg font-semibold text-gray-900 mb-3">
        Add Photos (Optional)
      </Text>
      
      {imageUris.length > 0 ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-3">
              {imageUris.map((uri, index) => (
                <View key={index} className="relative rounded-xl overflow-hidden h-32 w-32 bg-gray-100 border border-gray-200">
                  <Image
                    source={{ uri: uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 p-1.5 rounded-full"
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Add more button */}
              <View className="h-32 w-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 items-center justify-center gap-2">
                 <TouchableOpacity onPress={handleTakePhoto} className="items-center">
                    <Camera size={20} color="#6b7280" />
                    <Text className="text-xs text-gray-500 mt-1">Camera</Text>
                 </TouchableOpacity>
                 <View className="w-full h-[1px] bg-gray-200 my-1" />
                 <TouchableOpacity onPress={handleChooseFromGallery} className="items-center">
                    <ImageIcon size={20} color="#6b7280" />
                    <Text className="text-xs text-gray-500 mt-1">Gallery</Text>
                 </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="flex-1 bg-blue-50 p-4 rounded-xl items-center gap-2 border border-blue-100"
          >
            <Camera size={24} color="#3b82f6" />
            <Text className="text-blue-600 font-medium">Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleChooseFromGallery}
            className="flex-1 bg-purple-50 p-4 rounded-xl items-center gap-2 border border-purple-100"
          >
            <ImageIcon size={24} color="#a855f7" />
            <Text className="text-purple-600 font-medium">Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
