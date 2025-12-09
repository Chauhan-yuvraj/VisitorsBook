import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Mail, MoreVertical, Trash2, Phone } from "lucide-react-native";
import { Visitor } from "@/store/types/visitor";

interface VisitorCardProps {
  item: Visitor;
  onEdit: (visitor: Visitor) => void;
  onDelete: (visitor: Visitor) => void;
}

export const VisitorCard = ({ item, onEdit, onDelete }: VisitorCardProps) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const isBlocked = item.isBlocked;
  const statusColor = isBlocked
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
  const statusLabel = isBlocked ? "Blocked" : "Active";

  return (
    <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        {/* Avatar */}
        <View className="h-12 w-12 rounded-full bg-blue-50 items-center justify-center border border-blue-100 overflow-hidden">
          {item.profileImgUri ? (
            <Image
              source={{ uri: item.profileImgUri }}
              className="w-full h-full"
            />
          ) : (
            <Text className="text-blue-600 font-bold text-lg">
              {getInitials(item.name)}
            </Text>
          )}
        </View>

        {/* Info */}
        <View className="ml-4 flex-1">
          <View className="flex-row items-center">
            <Text className="text-gray-900 font-semibold text-base">
              {item.name}
            </Text>
            <View className={`ml-2 px-2 py-0.5 rounded-full ${statusColor.split(" ")[0]}`}>
              <Text className={`text-xs font-medium ${statusColor.split(" ")[1]}`}>
                {statusLabel}
              </Text>
            </View>
            {item.isVip && (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100">
                    <Text className="text-xs font-medium text-yellow-700">VIP</Text>
                </View>
            )}
          </View>

          <View className="flex-row items-center mt-1">
            {item.email && (
                <View className="flex-row items-center mr-3">
                    <Mail size={12} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1">{item.email}</Text>
                </View>
            )}
            {item.phone && (
                <View className="flex-row items-center">
                    <Phone size={12} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1">{item.phone}</Text>
                </View>
            )}
          </View>
          {item.companyNameFallback && (
              <Text className="text-gray-400 text-xs mt-1">{item.companyNameFallback}</Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onEdit(item)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onDelete(item)}
          className="p-2 rounded-full hover:bg-red-50 ml-1"
        >
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
