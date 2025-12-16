import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import React, { useCallback, useState } from "react";
import { CameraIcon, ImageIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Whitebg from "@/assets/background-pattern/Whitebg";
import { useAppDispatch } from "@/store/hooks";
import { saveRecord } from "@/store/slices/records.slice";
import { useLocalSearchParams } from "expo-router";
import {
  SerializableCanvasPage,
  SerializablePathData,
} from "@/store/types/feedback";
import { deserializeRouterParam } from "@/utils/serializationUtils";
import { useImagePicker } from "@/hooks/useImagePicker"; // Import the new hook

export default function GuestData() {
  const { pages, signature, feedbackText } = useLocalSearchParams();

  const canvasPages: SerializableCanvasPage[] = deserializeRouterParam(pages);
  const signaturePages: SerializablePathData[] =
    deserializeRouterParam(signature);

  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSelected = useCallback((uri: string | null) => {
    setSelectedImage(uri);
  }, []);

  const { handleTakePhoto, handleChooseFromGallery } =
    useImagePicker(handleImageSelected);

  const [formData, setFormData] = useState({
    name: "yuvraj",
    phone: "1324567890",
    email: "text@yuvraj.com",
    company: "dummy ltd",
    visitType: "casual",
  });

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  function submitData() {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Please enter your name.");
      return;
    }

    // signaturePages is already serialized, so pass it directly
    dispatch(
      saveRecord({
        guestData: {
          guestName: formData.name,
          guestImgUri: selectedImage || "",
          guestPhone: formData.phone,
          guestEmail: formData.email,
          guestCompany: formData.company,
        },
        canvasPages,
        signaturePaths: signaturePages,
        visitType: "",
        feedbackText: (feedbackText as string) || "",
      })
    );
  }

  return (
    <SafeAreaView className="flex-1 w-full">
      <View className="absolute inset-0 -z-10 opacity-50" pointerEvents="none">
        <Whitebg />
      </View>
      <View className="flex-1 bg-gray-50 p-4">
        <View className="flex-row flex-1 gap-4">
          {/* LEFT SIDE IMAGE */}
          <View className="w-1/2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <TouchableOpacity
              onPress={() =>
                !selectedImage &&
                Alert.alert("No Image", "Please upload an image first.")
              }
              className="flex-1 justify-center items-center bg-gray-100"
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center">
                  <ImageIcon color="#a1a1a1" size={40} />
                  <Text className="text-gray-500 mt-2">No image selected</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* IMAGE ACTION BUTTONS */}
            <View className="p-3 flex flex-row justify-center bg-white border-t border-gray-200 gap-x-3">
              <TouchableOpacity
                onPress={handleTakePhoto}
                className="flex-row items-center border justify-center p-3 rounded-lg"
              >
                <CameraIcon color="#555" size={20} />
                <Text className="text-[#555] ml-2 font-semibold">
                  Take Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleChooseFromGallery}
                className="flex-row items-center justify-center bg-[#555] border border-[#555] p-3 rounded-lg"
              >
                <ImageIcon color="white" size={20} />
                <Text className="text-[white] ml-2 font-semibold">
                  Upload from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT SIDE FORM */}
          <View className="w-1/2 flex justify-around bg-white rounded-xl border border-gray-200 p-4">
            <Text className="text-lg font-semibold mb-4 text-gray-800">
              Guest Details
            </Text>

            {/* NAME */}
            <Text className="text-sm text-gray-600 mb-1">Full Name</Text>
            <TextInput
              value={formData.name}
              onChangeText={(v) => updateField("name", v)}
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter name"
            />

            {/* PHONE */}
            <Text className="text-sm text-gray-600 mb-1">Phone Number</Text>
            <TextInput
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(v) => updateField("phone", v)}
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter phone"
            />

            {/* EMAIL */}
            <Text className="text-sm text-gray-600 mb-1">Email</Text>
            <TextInput
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(v) => updateField("email", v)}
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter email"
            />

            {/* COMPANY */}
            <Text className="text-sm text-gray-600 mb-1">Company</Text>
            <TextInput
              value={formData.company}
              onChangeText={(v) => updateField("company", v)}
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter company"
            />

            {/* VISIT TYPE */}
            <Text className="text-sm text-gray-600 mb-1">Visit Type</Text>
            <TextInput
              value={formData.visitType}
              onChangeText={(v) => updateField("visitType", v)}
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter visit type"
            />

            {/* SUBMIT */}
            <TouchableOpacity className="bg-green-600 p-4 rounded-lg mt-3">
              <Pressable onPress={submitData}>
                <Text className="text-center text-white text-lg font-semibold">
                  Submit
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
