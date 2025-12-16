import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import { Play, Pause, X } from "lucide-react-native";

// ... (AudioPlayer component remains unchanged)
const AudioPlayer = ({ uri }: { uri: string }) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  async function playSound() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          newSound.setPositionAsync(0);
        }
      });
    }
  }

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View className="bg-white p-4 rounded-xl border border-gray-200 flex-row items-center mb-4">
      <TouchableOpacity
        onPress={playSound}
        className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3"
      >
        {isPlaying ? (
          <Pause size={20} color="#3b82f6" />
        ) : (
          <Play size={20} color="#3b82f6" />
        )}
      </TouchableOpacity>
      <View>
        <Text className="font-medium text-gray-900">Audio Feedback</Text>
        <Text className="text-xs text-gray-500">Tap to play recording</Text>
      </View>
    </View>
  );
};

export default function RecordDetailScreen() {
  const { recordJson } = useLocalSearchParams();
  const record: any = recordJson ? JSON.parse(recordJson as string) : null;
  
  // 1. New State for the full-screen image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!record) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">
          Record not found or failed to load.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header Section */}
        <Text className="text-2xl text-center font-bold mb-1 text-gray-800">
          Visit Details
        </Text>
        <View className="flex flex-row items-center gap-x-16">
          <Image
            source={{ uri: record.VisitorId?.profileImgUri || undefined }}
            className="w-32 h-32 rounded-full bg-gray-200 mb-4"
            resizeMode="cover"
          />
          <View>
            <Text className="text-2xl text-primary mb-6">
              {record.VisitorId?.name || "Unknown Visitor"}{" "}
            </Text>
            <Text className="text-gray-600 mb-6">
              {new Date(record.timeStamp).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Feedback Section */}
        {record.feedbackText && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-800">
              Feedback
            </Text>
            <View className="bg-white p-4 rounded-xl border border-gray-200">
              <Text className="text-gray-700 leading-relaxed">
                {record.feedbackText}
              </Text>
            </View>
          </View>
        )}

        {/* Audio Section */}
        {record.audio && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-800">
              Audio Recording
            </Text>
            <AudioPlayer uri={record.audio} />
          </View>
        )}

        {/* Images Section */}
        {record.images && record.images.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-gray-800">
              Attached Images
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {record.images.map((uri: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    // 2. On Press: Set the state to this image URI
                    onPress={() => setSelectedImage(uri)}
                    className="h-48 w-48 rounded-xl overflow-hidden bg-gray-200 border border-gray-200"
                  >
                    <Image
                      source={{ uri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        <View className="h-12" />
      </ScrollView>

      {/* 3. Full Screen Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)} // Android hardware back button
      >
        <View className="flex-1 bg-black/95 justify-center items-center relative">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            className="absolute top-12 right-6 z-10 p-2 bg-gray-800/50 rounded-full"
          >
            <X color="white" size={28} />
          </TouchableOpacity>

          {/* The Large Image */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}