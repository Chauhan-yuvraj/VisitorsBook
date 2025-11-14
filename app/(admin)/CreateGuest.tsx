import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Background from "@/components/ui/background";
import { createGuestThunk, guestState } from "@/store/slices/guest.slice";
import { Guest } from "@/store/types/guest.type";
import { AppDispatch } from "@/store/store";
import * as ImagePicker from "expo-image-picker"; // Import the image picker
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView as ContextSafeAreaView } from "react-native-safe-area-context"; // Recommended for modern Expo
import { router } from "expo-router";

// Define the type for a Guest before the ID is assigned
type NewGuestData = Omit<Guest, "id">;

export default function CreateGuestScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(
    (state: { guest: guestState }) => state.guest
  );

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  // State to hold the local URI of the selected image
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  // Function to handle image selection
  const pickImage = async () => {
    // Request permission to access the media library
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera roll permissions to make this work!"
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !position.trim() || !localImageUri) {
      Alert.alert(
        "Required Fields",
        "Please enter the guest's name, position, and select an image."
      );
      return;
    }

    const newGuest: NewGuestData = {
      name: name.trim(),
      position: position.trim(),
      // Store the local URI/path. This will be used by GuestCard for display.
      img: localImageUri,
    };

    dispatch(createGuestThunk(newGuest as Guest))
      .unwrap()
      .then(() => {
        Alert.alert("Success", `${name} has been added successfully.`);
        // Clear the form
        setName("");
        setPosition("");
        setLocalImageUri(null); // Clear image preview
        router.replace("/(guest)/selectGuest");
      })
      .catch((error) => {
        Alert.alert("Error", error || "Could not save guest to local storage.");
      });
  };

  const SafeViewComponent = ContextSafeAreaView as any; // Cast to avoid RN-specific type error

  return (
    <Background image={require("@/assets/images/background.jpg")}>
      <SafeViewComponent className="flex-1 p-6 justify-center items-center">

        <View className="bg-white/90 p-6  rounded-xl shadow-xl min-w-96">
          <Text className="text-gray-700 font-semibold mb-1">Name:</Text>
          <TextInput
            className="border border-gray-300 p-3 rounded-lg mb-4 bg-white text-gray-800"
            placeholder="e.g., Jane Doe"
            value={name}
            onChangeText={setName}
          />

          <Text className="text-gray-700 font-semibold mb-1">
            Position / Title:
          </Text>
          <TextInput
            className="border border-gray-300 p-3 rounded-lg mb-4 bg-white text-gray-800"
            placeholder="e.g., VIP, Speaker"
            value={position}
            onChangeText={setPosition}
          />

          {/* --- IMAGE PICKER SECTION --- */}
          <Text className="text-gray-700 font-semibold mb-2">Guest Image:</Text>

          {/* Image Preview */}
          {localImageUri ? (
            <View className="flex items-center mb-4">
              <Image
                source={{ uri: localImageUri }}
                className="w-24 h-24 rounded-full border-2 border-blue-500"
              />
            </View>
          ) : (
            <View className="flex items-center justify-center h-24 mb-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Ionicons name="image-outline" size={32} color="gray" />
              <Text className="text-gray-500 mt-1">No Image Selected</Text>
            </View>
          )}

          {/* Image Picker Button */}
          <TouchableOpacity
            onPress={pickImage}
            className="p-3 mb-6 rounded-lg border border-blue-500 bg-blue-50"
          >
            <Text className="text-blue-600 text-center font-semibold">
              {localImageUri ? "Change Image" : "Select Image from Library"}
            </Text>
          </TouchableOpacity>
          {/* --- END IMAGE PICKER SECTION --- */}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading === "pending"}
            className={`p-4 rounded-lg shadow-md ${
              loading === "pending" ? "bg-gray-400" : "bg-green-600"
            }`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading === "pending" ? "Saving..." : "Create Guest"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeViewComponent>
    </Background>
  );
}
