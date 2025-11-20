import Background from "@/components/Background";
import Card from "@/components/Card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getRecords } from "@/store/slices/records.slice";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Options() {
  const dispatch = useAppDispatch();

  const { records, status, error } = useAppSelector((state) => state.records);

  useEffect(() => {
    dispatch(getRecords());
  }, [dispatch]);
  // Inside Options.tsx, near the top of the return statement:
  if (status === "loading") {
    return (
      <Background>
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text>Loading visitors...</Text>
        </SafeAreaView>
      </Background>
    );
  }
  return (
    <Background>
      <SafeAreaView className="flex-1">
        {/* Make the ScrollView horizontal */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
          <View className="flex-row flex-wrap  gap-4">
            {records.map((record) => (
              <Card key={record.id} record={record} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
