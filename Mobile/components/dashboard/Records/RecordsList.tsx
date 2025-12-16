import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRecords } from "@/store/slices/records.slice";
import { RecordCard } from "./RecordCard";
import { FeedbackRecord } from "@/store/types/feedback";
import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { DateFilter } from "../DateFilter";
import { useRefresh } from "@/hooks/useRefresh";

export default function RecordsList() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { records, status } = useAppSelector((state) => state.records);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const loadData = useCallback(() => dispatch(getRecords()), [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { refreshing, onRefresh } = useRefresh(async () => loadData());

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.VisitorId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (startDate) {
      const recordDate = new Date(record.timeStamp);
      const rTime = recordDate.getTime();
      
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const startTime = start.getTime();

      let endTime;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        endTime = end.getTime();
      } else {
        const end = new Date(startDate);
        end.setHours(23, 59, 59, 999);
        endTime = end.getTime();
      }
      
      matchesDate = rTime >= startTime && rTime <= endTime;
    }

    return matchesSearch && matchesDate;
  });

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
      <View className="flex-col mb-6">
        <View className="flex-row gap-3 mb-4">
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
        
        <DateFilter 
          startDate={startDate} 
          endDate={endDate} 
          onFilterChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }} 
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item._id || Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
