import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, X } from "lucide-react-native";

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onFilterChange: (start: Date | null, end: Date | null) => void;
}

export const DateFilter = ({
  startDate,
  endDate,
  onFilterChange,
}: DateFilterProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      // If end date exists and is before new start date, clear end date
      let newEndDate = endDate;
      if (endDate && selectedDate > endDate) {
        newEndDate = null;
      }
      onFilterChange(selectedDate, newEndDate);
    }
  };

  const handleEndChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      onFilterChange(startDate, selectedDate);
    }
  };

  const clearFilter = () => {
    onFilterChange(null, null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-row items-center gap-2 mb-4 flex-wrap">
      <TouchableOpacity
        onPress={() => setShowStartPicker(true)}
        className={`flex-row items-center px-3 py-2 rounded-lg border ${
          startDate ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
        }`}
      >
        <Calendar size={16} color={startDate ? "#2563eb" : "#6b7280"} />
        <Text
          className={`ml-2 ${startDate ? "text-blue-700" : "text-gray-500"}`}
        >
          {startDate ? formatDate(startDate) : "Start Date"}
        </Text>
      </TouchableOpacity>

      {startDate && (
        <>
          <Text className="text-gray-400">-</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className={`flex-row items-center px-3 py-2 rounded-lg border ${
              endDate
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            <Calendar size={16} color={endDate ? "#2563eb" : "#6b7280"} />
            <Text
              className={`ml-2 ${endDate ? "text-blue-700" : "text-gray-500"}`}
            >
              {endDate ? formatDate(endDate) : "End Date"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {(startDate || endDate) && (
        <TouchableOpacity
          onPress={clearFilter}
          className="p-2 bg-red-50 rounded-full ml-2"
        >
          <X size={16} color="#ef4444" />
        </TouchableOpacity>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndChange}
          minimumDate={startDate || undefined}
        />
      )}
    </View>
  );
};
