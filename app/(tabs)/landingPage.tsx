import { View, Text, Pressable, Image, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";
import { router } from "expo-router";
import { House, Settings } from "lucide-react-native";
import Background from "@/components/ui/background";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/store/hooks";
import RecordDetailModal from "@/components/RecordDetailModal";
import { FeedbackRecord } from "@/store/types/feedback";

export default function LandingPage() {
  const { records } = useAppSelector((s) => s.records);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeedbackRecord | null>(
    null
  );

  const handleViewRecord = (record: FeedbackRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  // Filter for featured records
  const featuredRecords = useMemo(() => {
    return records
      .filter((record) => record.featured)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [records]);

  return (
    <Background image={require("@/assets/images/bg2.jpg")}>
      <SafeAreaView className="flex-1 px-8 pt-4 pb-8">
        {/* Top buttons (Re-positioned to Top Left) */}
        <View className="flex flex-row gap-8 justify-start items-center">
          <Pressable
            onPress={() => router.push("/")}
            className="bg-gray-400/50 rounded-xl p-3"
          >
            <House color="white" size={24} />
          </Pressable>

          {/* Settings button */}
          <Pressable
            onPress={() => router.push("/loginPage")}
            className="bg-gray-400/50 rounded-xl p-3"
          >
            <Settings color="white" size={24} />
          </Pressable>
        </View>

        {/* Foreground content (flex-1 to center it in the remaining space) */}
        <View className="flex-1 justify-center items-center gap-y-20">
          <Image
            source={require("@/assets/images/icon.png")}
            className="w-40 h-40" // Slightly larger logo for presence
            resizeMode="cover"
          />

          <View className="flex flex-row gap-x-4">
            <Text className="text-6xl font-extrabold text-orange-600">
              DIGITAL{" "}
            </Text>
            <Text className="text-6xl font-extrabold text-white">
              VISITORS{" "}
            </Text>
            <Text className="text-6xl font-extrabold text-green-500">BOOK</Text>
          </View>

          <Pressable
            onPress={() => router.push("/(guest)/selectGuest")}
            className="border border-green-500 bg-green-500 px-10 py-5 rounded-lg shadow-lg"
          >
            <Text className="text-white text-2xl font-semibold uppercase text-center">
              Start Feedback
            </Text>
          </Pressable>
        </View>

        {/* Featured Feedback Section (Visibility Ensured) */}
        <View className=" mt-4 bg-white/30 p-3 rounded-xl">
          {featuredRecords.length > 0 ? (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              {featuredRecords.map((record) => (
                <Pressable
                  key={record.id}
                  // >>> MODIFIED LINE HERE <<<
                  onPress={() => handleViewRecord(record)}
                  className="mx-4"
                >
                  <View className="flex flex-col p-1 gap-y-2 items-center bg-white/50 rounded-md">
                    <Image
                      source={{ uri: record.guestImgUri }}
                      className="w-32 h-32 rounded-md bg-gray-300"
                    />
                    <Text className="text-yellow-300 font-bold">
                      {record.guestName}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
        </View>

        {/* Record Detail Modal */}
        {selectedRecord && (
          <RecordDetailModal
            record={selectedRecord}
            visible={modalVisible}
            onClose={handleCloseModal}
          />
        )}
      </SafeAreaView>
    </Background>
  );
}
