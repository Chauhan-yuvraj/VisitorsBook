import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitsThunk, setSelectedVisit } from "@/store/slices/visit.slice";
import { Visit } from "@/store/types/visit";
import { AppDispatch, RootState } from "@/store/store";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Background from "@/components/Background";

const VisitCard = ({ visit }: { visit: Visit }) => {
  return (
    // Changed: Added w-72 to fix width, creating a "box" shape
    <View className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
      {/* Top: Image Section (Square aspect ratio for box look) */}
      <View className="h-64 w-full bg-gray-200 relative">
        <Image
          source={{
            uri:
              visit.visitor.profileImgUri || "https://via.placeholder.com/300",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Floating Badge */}
        <View className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
          <Text className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
            {visit.visitor.company || "Visitor"}
          </Text>
        </View>
      </View>

      {/* Bottom: Details Section */}
      <View className="p-4">
        <Text
          className="text-xl font-extrabold text-gray-900  mb-1"
          numberOfLines={1}
        >
          {visit.visitor.name}
        </Text>

        <View className="h-[1px] bg-gray-100 w-1/2 self-center my-3" />

        <View className="flex-row items-center  space-x-2">
          <Text className="text-xs text-gray-400">Meeting : </Text>
          <Text className="text-sm font-semibold text-gray-700">
            {visit.host.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function SelectVisit() {
  const dispatch = useDispatch<AppDispatch>();
  const { visits, loading, error } = useSelector(
    (state: RootState) => state.visits
  );

  useEffect(() => {
    dispatch(fetchVisitsThunk({ status: "CHECKED_IN" }));
  }, [dispatch]);

  const handleVisitSelection = (visit: Visit) => {
    dispatch(setSelectedVisit(visit));
    router.push("/(canvas)/Canvas");
  };

  if (loading === "pending" && visits.length === 0) {
    return (
      <Background>
        <ActivityIndicator size="large" color="#FFFFFF" className="flex-1" />
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView className="flex-1">
        {error && <Text className="text-red-400 text-center p-4">{error}</Text>}

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {visits.length === 0 ? (
            <Text className="text-white text-center text-lg mt-10">
              No active visits found.
            </Text>
          ) : (
            // Changed: Added flex-row, flex-wrap, and justify-center to create a grid/centered layout
            <View className="flex-row flex-wrap">
              {visits.map((visit) => (
                <TouchableOpacity
                  key={visit._id}
                  onPress={() => handleVisitSelection(visit)}
                  activeOpacity={0.9}
                  className="w-1/3 p-2"
                >
                  <VisitCard visit={visit} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
