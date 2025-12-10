import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Mail, MoreVertical, Trash2 } from "lucide-react-native";
import { Employee } from "@/store/types/user";
import {
  getInitials,
  getStatusColor,
  getStatusLabel,
} from "@/utils/employees/employee.utils";

interface EmployeeCardProps {
  item: Employee;
  onEdit: (employee: Employee) => void; // <--- ADD THIS
  onDelete: (employee: Employee) => void;
}

export const EmployeeCard = ({ item, onEdit, onDelete }: EmployeeCardProps) => {
  const isActive = item.isActive;
  const statusColor = getStatusColor(isActive);
  const statusLabel = getStatusLabel(isActive);

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
            <View
              className={`ml-3 px-2 py-0.5 rounded-full ${
                statusColor.split(" ")[0]
              }`}
            >
              <Text
                className={`text-xs font-medium ${statusColor.split(" ")[1]}`}
              >
                {statusLabel}
              </Text>
            </View>
          </View>
          <Text className="text-gray-500 text-sm mt-0.5">
            {item.jobTitle} • {item.department}
          </Text>
          <View className="flex-row items-center mt-1">
            <Mail size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs ml-1">{item.email}</Text>
          </View>
        </View>
      </View>

      {/* Edit Trigger */}
      {item.isActive ? (
        <TouchableOpacity className="p-2" onPress={() => onDelete(item)}>
          <Trash2 size={20} color="red" />
        </TouchableOpacity>
      ) : null}

      {/* Edit Trigger */}
      <TouchableOpacity className="p-2" onPress={() => onEdit(item)}>
        <MoreVertical size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};
