import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, memo, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRecords, deleteRecord } from "@/store/slices/records.slice";
import { SafeAreaView } from "react-native-safe-area-context";
import Background from "@/components/ui/background";
import { Trash2, Eye } from "lucide-react-native";
import { FeedbackRecord } from "@/services/feedback.service";
import RecordDetailModal from "@/components/RecordDetailModal";
import { Canvas, Path, Skia, rect } from "@shopify/react-native-skia";

// --- Constants for Table Layout ---
const COL_WIDTHS = {
  IMAGE: 150,
  DETAILS: 250,
  PREVIEW: 200,
  ACTIONS: 200,
  DATETIME: 200,
};
const PREVIEW_SIZE = 150;

// Skia path deserialization helper
const createSkPathFromSvg = (svgString: string) => {
  return Skia.Path.MakeFromSVGString(svgString);
};

// Calculate bounds of all paths and return scale/offset to fit in preview
const calculateTransform = (paths: any[], previewSize: number) => {
  if (!paths || paths.length === 0) return { scale: 1, offsetX: 0, offsetY: 0 };

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  paths.forEach((pathData) => {
    const path = createSkPathFromSvg(pathData.svg);
    if (!path) return;

    const bounds = path.computeTightBounds();
    if (!bounds) return;

    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

  if (!isFinite(minX)) return { scale: 1, offsetX: 0, offsetY: 0 };

  const width = maxX - minX;
  const height = maxY - minY;

  // Add padding
  const padding = 10;
  const availableSize = previewSize - padding * 2;

  // Calculate scale to fit
  const scale = Math.min(availableSize / width, availableSize / height);

  // Center the drawing
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const offsetX = (previewSize - scaledWidth) / 2 - minX * scale;
  const offsetY = (previewSize - scaledHeight) / 2 - minY * scale;

  return { scale, offsetX, offsetY };
};

// --- Small Preview Component ---
const DrawingPreview: React.FC<{
  record: FeedbackRecord;
  type: "drawing" | "signature";
}> = memo(
  ({ record, type }) => {
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

  return (
    <View className="flex-row items-center bg-white border-b border-gray-100 py-2 px-1">
      {/* 1. Image */}
      <View style={{ width: COL_WIDTHS.IMAGE }}>
        <Image
          source={{ uri: record.guestImgUri }}
          className="w-32 h-32 rounded-md bg-gray-300"
        />
      </View>

      {/* 2. Details (Name, Position) */}
      <View className="flex-1">
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
      <View
        style={{ width: COL_WIDTHS.PREVIEW }}
        className="items-center justify-center"
      >
        <DrawingPreview record={record} type="drawing" />
      </View>

      {/* 4. Signature Preview */}
      <View
        style={{ width: COL_WIDTHS.PREVIEW }}
        className="items-center justify-center"
      >
        <DrawingPreview record={record} type="signature" />
      </View>

      {/* 5. Date/Time */}
      <View style={{ width: COL_WIDTHS.DATETIME }} className="pl-2">
        <Text className="text-xs text-gray-700">
          {formatDate(record.timestamp)}
        </Text>
      </View>

      {/* 6. Actions (View, Delete) */}
      <View
        style={{ width: COL_WIDTHS.ACTIONS }}
        className="flex-row justify-around items-center"
      >
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

// --- Table Header ---
const TableHeader = () => (
  <View className="flex-row bg-gray-200 py-2.5 px-1 border-b-2 border-gray-300 rounded-t-xl">
    <View style={{ width: COL_WIDTHS.IMAGE }}>
      <Text className="text-xs font-bold text-gray-700 text-center">Img</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Details
      </Text>
    </View>
    <View style={{ width: COL_WIDTHS.PREVIEW }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Feedback
      </Text>
    </View>
    <View style={{ width: COL_WIDTHS.PREVIEW }}>
      <Text className="text-xs font-bold text-gray-700 text-center">Sig</Text>
    </View>
    <View style={{ width: COL_WIDTHS.DATETIME }} className="pl-2">
      <Text className="text-xs font-bold text-gray-700">Time</Text>
    </View>
    <View style={{ width: COL_WIDTHS.ACTIONS }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Actions
      </Text>
    </View>
  </View>
);

// --- Main Screen Component ---
export default function RecordsScreen() {
  const dispatch = useAppDispatch();
  const { records, status, error } = useAppSelector((state) => state.records);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FeedbackRecord | null>(
    null
  );

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
  } else {
    content = (
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1" style={{ minWidth: 600 }}>
          <TableHeader />
          <FlatList
            data={records}
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
        <SafeAreaView className="flex-1 p-4">
          <View className="flex-1 bg-white/10 rounded-xl overflow-hidden">
            {content}
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
