import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper"; // Using Paper for avatars

interface VisitorRowProps {
  name: string;
  company: string;
  host: string;
  time: string;
  status: "Active" | "Inactive" | "Pending" | "Departed";
  image?: string; // URL of the visitor's image
}

const VisitorRow = ({
  name,
  company,
  host,
  time,
  status,
  image,
}: VisitorRowProps) => {
  // Status styling logic
  const isWeb = status === "Active";
  const statusBg = isWeb ? "bg-green-50" : "bg-gray-100";
  const statusText = isWeb ? "text-green-600" : "text-gray-500";

  return (
    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-50 active:bg-gray-50">
      {/* Avatar & Name */}
      <View className="flex-row items-center flex-1">
        {image ? (
          <Avatar.Image
            size={40}
            source={{ uri: image }}
            className="bg-gray-200 mr-3"
          />
        ) : (
          <Avatar.Text
            size={40}
            label={name.substring(0, 2)}
            className="bg-indigo-100 mr-3"
            color="#4f46e5"
          />
        )}
        <View>
          <Text className="font-semibold text-gray-900 text-sm">{name}</Text>
          <Text className="text-xs text-gray-400">{company}</Text>
        </View>
      </View>

      {/* Host (Hidden on small screens logic could go here, but we keep it simple) */}
      <View className="hidden md:flex w-24">
        <Text className="text-xs text-gray-500">{host}</Text>
      </View>

      {/* Time */}
      <View className="w-16 items-end mr-4">
        <Text className="text-xs font-mono text-gray-400">{time}</Text>
      </View>

      {/* Status Pill */}
      <View className={`px-2 py-1 rounded-full ${statusBg}`}>
        <Text className={`text-[10px] font-bold ${statusText}`}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default VisitorRow;
