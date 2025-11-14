// RecordsScreen.tsx (Updated)

import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState, memo, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRecords,
  deleteRecord,
  toggleFeature, // <-- Import the new thunk
} from "@/store/slices/records.slice";
import { SafeAreaView } from "react-native-safe-area-context";
import Background from "@/components/ui/background";
import { Trash2, Eye, Search } from "lucide-react-native";
import RecordDetailModal from "@/components/RecordDetailModal";
import { Canvas, Path } from "@shopify/react-native-skia";
import {
  PREVIEW_SIZE,
  MIN_TABLE_WIDTH,
} from "@/constants/constant";
import { calculateTransform, createSkPathFromSvg } from "@/utils/Result.utils";
import { TableHeader } from "@/components/TableHeader";
import { FeedbackRecord } from "@/store/types/feedback";
import { Switch } from "react-native-paper";

// ... (DrawingPreview component remains unchanged) ...
const DrawingPreview: React.FC<{
  record: FeedbackRecord;
  type: "drawing" | "signature";
}> = memo(
  ({ record, type }) => {
    // ... (implementation unchanged)
    const data = type === "drawing" ? record.pages[0]?.paths : record.signature;
    const pathColor =
      type === "signature" ? "#000000" : data?.[0]?.color || "#4B5563";

    const { scale, offsetX, offsetY } = useMemo(
      () => calculateTransform(data, PREVIEW_SIZE),
      [data]
    );

    if (!data || data.length === 0) {
      return (
        <Text className="text-[10px] text-gray-400 text-center mt-3">N/A</Text>
      );
    }

    return (
      <View
        className="bg-white rounded-sm border border-gray-300 overflow-hidden"
        style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
      >
        <Canvas style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}>
          {data.map((pathData, index) => {
            const path = createSkPathFromSvg(pathData.svg);
            if (!path) return null;

            // Create a transformed path
            const transformedPath = path.copy();
            transformedPath.transform([
              scale,
              0,
              offsetX,
              0,
              scale,
              offsetY,
              0,
              0,
              1,
            ]);

            return (
              <Path
                key={index}
                path={transformedPath}
                color={
                  type === "signature" ? "#000000" : pathData.color || pathColor
                }
                style="stroke"
                strokeWidth={
                  (pathData.strokeWidth || 3) *
                  Math.max(0.5, Math.min(1, scale))
                }
                strokeCap="round"
                strokeJoin="round"
              />
            );
          })}
        </Canvas>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.record.id === nextProps.record.id
);

DrawingPreview.displayName = "DrawingPreview";

// --- Table Row Component ---
const RecordRow: React.FC<{
  record: FeedbackRecord;
  onView: (record: FeedbackRecord) => void;
}> = ({ record, onView }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteRecord(record.id));
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const toggleFeatured = () => {
    // Dispatch the new thunk, passing necessary information
    dispatch(
      toggleFeature({
        id: record.id,
        currentFeaturedStatus: record.featured || false,
      })
    );
  };

  return (
    <View className="flex-row items-center justify-evenly w-full bg-white border-b border-gray-100 py-2 px-1">
      {/* 1. Image */}
      <View>
        <Image
          source={{ uri: record.guestImgUri }}
          className="w-32 h-32 rounded-md bg-gray-300"
        />
      </View>

      {/* 2. Details (Name, Position) */}
      <View>
        <Text
          className="text-2xl font-semibold text-gray-900"
          numberOfLines={1}
        >
          {record.guestName}
        </Text>
        <Text className="text-md text-gray-600" numberOfLines={1}>
          {record.guestPosition}
        </Text>
      </View>

      {/* 3. Drawing Preview */}
      <View className="items-center justify-center">
        <DrawingPreview record={record} type="drawing" />
      </View>

      {/* 4. Signature Preview */}
      <View className="items-center justify-center">
        <DrawingPreview record={record} type="signature" />
      </View>

      {/* 5. Date/Time */}
      <View className="pl-2">
        <Text className="text-md text-gray-700">
          {formatDate(record.timestamp)}
        </Text>
      </View>

      {/* 6. Display (Switch) */}
      <View className="pl-2">
        {/* The component re-renders when the state updates */}
        <Switch value={record.featured} onValueChange={toggleFeatured} />
      </View>

      {/* 7. Actions (View, Delete) */}
      <View className="flex-row justify-around items-center">
        <Pressable
          onPress={() => onView(record)}
          className="p-1.5 rounded bg-green-500/10 active:bg-green-500/20"
        >
          <Eye size={24} color="#22C55E" />
        </Pressable>
        <Pressable
          onPress={handleDelete}
          className="p-1.5 rounded bg-red-500/10 active:bg-red-500/20"
        >
          <Trash2 size={24} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );
};

// ... (RecordsScreen component remains unchanged, as it uses the updated RecordRow) ...
export default function RecordsScreen() {
  const dispatch = useAppDispatch();
  const { records, status, error } = useAppSelector((state) => state.records);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeedbackRecord | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewRecord = (record: FeedbackRecord) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRecords());
    }
  }, [status, dispatch]);

  // Filter records based on the search query
  const filteredRecords = useMemo(() => {
    if (!searchQuery) {
      return records;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();

    return records.filter((record) => {
      // 1. Check Guest Name
      if (record.guestName.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      // 2. Check Guest Position
      if (record.guestPosition.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      // 3. Check Date/Time (format the timestamp for searching)
      const dateString = new Date(record.timestamp).toLocaleString();
      if (dateString.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }
      return false;
    });
  }, [records, searchQuery]);

  let content;
  if (status === "loading") {
    content = (
      <Text className="text-gray-300 text-center mt-12 text-base">
        Loading records...
      </Text>
    );
  } else if (status === "failed") {
    content = (
      <Text className="text-red-500 text-center mt-12 text-base">
        Error: {error}
      </Text>
    );
  } else if (records.length === 0) {
    content = (
      <Text className="text-gray-300 text-center mt-12 text-base">
        No feedback records found.
      </Text>
    );
  } else if (filteredRecords.length === 0) {
    content = (
      <Text className="text-gray-300 text-center mt-12 text-base">
        No results found for {searchQuery}.
      </Text>
    );
  } else {
    content = (
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1" style={{ minWidth: MIN_TABLE_WIDTH }}>
          <TableHeader />
          <FlatList
            data={filteredRecords} // Use filtered list
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecordRow record={item} onView={handleViewRecord} />
            )}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <Background image={require("@/assets/images/background.jpg")}>
        <SafeAreaView className="flex-1 justify-start px-4 pb-4 pt-0">
          <View className="flex-1 bg-white/10  rounded-xl overflow-hidden">
            {/* Added mt-4 to provide spacing below the safe area */}
            <View className="p-4 bg-white/5 rounded-t-xl">
              <View className="flex-row items-center bg-white/90 p-3 rounded-lg border border-gray-300 shadow-md">
                <Search size={20} color="#6B7280" className="mr-3" />
                <TextInput
                  placeholder="Search by name, position, or date..."
                  placeholderTextColor="#6B7280"
                  className="flex-1 text-gray-800 text-lg"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
            {/* --- Table Content Area --- */}
            <View className="flex-1 overflow-hidden">{content}</View>
          </View>
        </SafeAreaView>
      </Background>

      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
