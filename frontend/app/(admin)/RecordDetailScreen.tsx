import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DisplayCanvas from "@/components/DisplayCanvas";
import {
  SerializableCanvasPage,
  SerializablePathData,
} from "@/store/types/feedback";
import { useLocalSearchParams } from "expo-router";

const SignatureDisplay = ({
  signaturePaths,
}: {
  signaturePaths: SerializablePathData[];
}) => {
  const signaturePage: SerializableCanvasPage = {
    id: "signature",
    paths: signaturePaths,
  };

  return (
    <View className="w-full h-[150px] mb-5 border border-gray-300 rounded-lg overflow-hidden bg-white">
      <DisplayCanvas page={signaturePage} />
    </View>
  );
};

export default function RecordDetailScreen() {
  const { recordJson } = useLocalSearchParams();

  const record: any = recordJson ? JSON.parse(recordJson as string) : null;

  if (!record) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">
          Record not found or failed to load.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold mb-5 text-gray-800">
          Visit Details for {record.VisitorId?.name || "Unknown Visitor"}
        </Text>
        <Text className="text-xl font-semibold mt-3 mb-2 text-gray-700 border-b border-gray-200 pb-1">
          Visitor Signature
        </Text>
        {record.signature && record.signature.length > 0 ? (
          <SignatureDisplay signaturePaths={record.signature} />
        ) : (
          <Text className="text-gray-400 italic mb-5">
            No signature provided.
          </Text>
        )}
        <Text className="text-xl font-semibold mt-3 mb-2 text-gray-700 border-b border-gray-200 pb-1">
          Drawing Pages
        </Text>
        {record.pages && record.pages.length > 0 ? (
          record.pages.map((page: any, index: any) => (
            <View
              key={page.id}
              className="mb-5 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              <Text className="text-base font-bold p-3 border-b border-gray-100 bg-gray-50">
                Page {index + 1}
              </Text>
              <View className="w-full" style={{ aspectRatio: 1.414 }}>
                <DisplayCanvas page={page} />
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 italic mb-5">
            No drawing pages found.
          </Text>
        )}
        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}
