import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";

interface EmployeeFormHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

export const EmployeeFormHeader: React.FC<EmployeeFormHeaderProps> = ({
  isEditMode,
  onClose,
}) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100 bg-white rounded-t-3xl">
      <View>
        <Text className="text-xl font-bold text-gray-900">
          {isEditMode ? "Edit Employee" : "New Employee"}
        </Text>
        <Text className="text-sm text-gray-500">
          {isEditMode
            ? "Update employee details below"
            : "Fill in the information to add a new member"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onClose}
        className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center"
      >
        <X size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};
