import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FeedbackRecord } from "@/store/types/feedback";
import { Calendar, Clock, User } from "lucide-react-native";

interface RecordCardProps {
  record: FeedbackRecord;
  onPress: (record: FeedbackRecord) => void;
}

export const RecordCard = ({ record, onPress }: RecordCardProps) => {
  const date = new Date(record.timeStamp).toLocaleDateString();
  const time = new Date(record.timeStamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      onPress={() => onPress(record)}
      className="bg-white p-4 rounded-xl border border-gray-100 mb-3 shadow-sm flex-row items-center"
    >
      {/* Avatar */}
      <View className="h-12 w-12 rounded-full bg-gray-100 items-center justify-center overflow-hidden mr-4">
        {record.VisitorId?.profileImgUri ? (
          <Image
            source={{ uri: record.VisitorId.profileImgUri }}
            className="h-full w-full"
          />
        ) : (
          <User size={24} color="#9CA3AF" />
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 text-base">
          {record.VisitorId?.name || "Unknown Visitor"}
        </Text>
        <Text className="text-gray-500 text-sm mt-0.5">
          {record.visitType}
        </Text>
      </View>

      {/* Date/Time */}
      <View className="items-end">
        <View className="flex-row items-center mb-1">
          <Calendar size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-1">{date}</Text>
        </View>
        <View className="flex-row items-center">
          <Clock size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-1">{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
