// components/Card.tsx (Corrected)
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Eye, Star, Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { deleteRecord } from "@/store/slices/records.slice";

// The component function Card must return the JSX directly
export default function Card({ record }: { record: any }) {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = React.useState(false); // New state for deletion feedback

  const visitor = record?.VisitorId;

  const handleDelete = async () => {
    if (!record?._id || isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteRecord(record._id)).unwrap();
      // On success, the item is removed from Redux, and the component is unmounted.
    } catch (error) {
      console.error("Failed to delete record:", error);
      setIsDeleting(false);
      Alert.alert("Error", "Failed to delete record. Please try again.");
    }
  };

  // Define istTime outside of the render return for cleaner logic
  const istTime = record?.timeStamp
    ? new Date(record.timeStamp).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : "No Phone Provided";

  // --- COMPONENT'S MAIN RETURN START ---
  return (
    <View className="w-[45%] md:w-64 bg-white/70 border border-gray-300 rounded-lg flex items-center p-3 mb-4 shadow-md">
      {/* Image Section */}
      <View className="w-full aspect-square overflow-hidden mb-3">
        <Image
          source={
            visitor?.profileImgUri
              ? { uri: visitor.profileImgUri }
              : require("@/assets/images/bg.jpg")
          }
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
          resizeMode="cover"
        />
      </View>

      {/* Text Details Section */}
      <View className="flex w-full items-start pb-2 border-b border-gray-200">
        <Text className="text-xl font-bold max-w-full">
          {visitor?.name || "No Name"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          {visitor?.email || "No Email Provided"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          {visitor?.company || "No Company Provided"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          {istTime}
        </Text>
      </View>

      {/* Action Buttons Section */}
      <View className="flex flex-row gap-x-3 mt-4 w-full justify-around">
        <TouchableOpacity className="border border-gray-300 p-2 rounded-md bg-white flex-1 items-center">
          <Star color={"black"} size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Serialize the entire record object to pass it, or just pass the ID
            const recordJson = JSON.stringify(record);
            router.push({
              pathname: "/(admin)/RecordDetailScreen", // Replace with your actual path
              params: { recordJson },
            });
          }}
          className="border border-gray-300 p-2 rounded-md bg-white flex-1 items-center"
        >
          <Eye color={"black"} size={20} />
        </TouchableOpacity>

        {/* Trash Icon using the correctly defined handleDelete function */}
        <TouchableOpacity
          onPress={handleDelete}
          disabled={isDeleting}
          className={`border border-gray-300 p-2 rounded-md flex-1 items-center 
                      ${isDeleting ? "bg-red-200" : "bg-white"}`}
        >
          {isDeleting ? (
            <Text className="text-red-700 font-semibold">Deleting...</Text>
          ) : (
            <Trash2 color={"black"} size={20} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
