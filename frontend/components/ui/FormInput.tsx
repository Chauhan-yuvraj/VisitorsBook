import React from "react";
import { View, Text, TextInput } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: LucideIcon;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = "default",
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-12 focus:border-primary">
      <Icon size={18} color="#9CA3AF" />
      <TextInput
        className="flex-1 ml-3 text-gray-900 text-base"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#D1D5DB"
        keyboardType={keyboardType}
      />
    </View>
  </View>
);
