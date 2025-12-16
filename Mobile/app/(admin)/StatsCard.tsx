import React from "react";
import { View, Text } from "react-native";

interface StatCardProps {
  label: string;
  value: number | string;
  subLabel?: string;
  trend?: string;
  isAlert?: boolean;
}

const StatCard = ({
  label,
  value,
  subLabel,
  trend,
  isAlert,
}: StatCardProps) => {
  return (
    <View className="bg-surface p-5 rounded-3xl mb-4 shadow-sm border border-gray-100 flex-1 min-w-[150px] mx-1">
      <View className="flex-row justify-between items-start mb-4">
        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">
          {label}
        </Text>
        {trend && (
          <View className="bg-green-50 px-2 py-1 rounded-full flex-row items-center">
            <Text className="text-green-600 text-xs font-bold">{trend}</Text>
          </View>
        )}
        {isAlert && (
          <View className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
        )}
      </View>

      <View>
        <Text className="text-3xl font-bold text-primary tracking-tight">
          {value}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">{subLabel}</Text>
      </View>
    </View>
  );
};

export default StatCard;
