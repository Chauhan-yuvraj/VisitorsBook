import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRecords } from "@/store/slices/records.slice";
import { RecordCard } from "./RecordCard";
import { FeedbackRecord } from "@/store/types/feedback";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";

export default function RecordsList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { records, status } = useAppSelector((state) => state.records);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getRecords());
  }, [dispatch]);

  const filteredRecords = records.filter((record) =>
    record.VisitorId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePress = (record: FeedbackRecord) => {
    router.push({
      pathname: "/(admin)/RecordDetailScreen",
      params: { recordJson: JSON.stringify(record) },
    });
  };

  if (status === "loading") {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            Concluded Visits
          </Text>
          <Text className="text-gray-500 mt-1">
            History of all completed visits and feedback
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-12">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search records..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={({ item }) => (
          <RecordCard record={item} onPress={handlePress} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400 text-base">No records found</Text>
          </View>
        }
      />
    </View>
  );
}
