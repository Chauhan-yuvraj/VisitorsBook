import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateVisitThunk } from "@/store/slices/visit.slice";
import { saveRecord } from "@/store/slices/records.slice";
import { Audio } from "expo-av";
import {
  Mic,
  Square,
  Play,
  Trash2,
  Type,
  FileAudio,
  Camera,
  Image as ImageIcon,
  X,
} from "lucide-react-native";
// 1. Import SegmentedButtons
import { SegmentedButtons } from "react-native-paper";
import Whitebg from "@/assets/background-pattern/Whitebg";
import ButtonUI from "@/components/ui/button";
import { useImagePicker } from "@/hooks/useImagePicker";

export default function CanvasScreen() {
  const [mode, setMode] = useState<"text" | "audio">("audio");
  const [feedbackText, setFeedbackText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | undefined>(
    undefined
  );
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { selectedVisit } = useSelector((state: RootState) => state.visits);

  const { handleTakePhoto, handleChooseFromGallery } = useImagePicker((uri) => {
    setImageUri(uri);
  });

  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant audio recording permission."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording");
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    if (!recording) return;

    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    setAudioUri(uri);
  }

  async function playSound() {
    if (!audioUri) return;
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);

    console.log("Playing Sound");
    setIsPlaying(true);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  }

  function deleteRecording() {
    setAudioUri(null);
    setSound(undefined);
    setIsPlaying(false);
  }

  const handleSubmit = async () => {
    if (!feedbackText && !audioUri) {
      Alert.alert(
        "Action Required",
        "Please provide either text feedback or an audio recording."
      );
      return;
    }

    if (selectedVisit) {
      setIsSubmitting(true);
      try {
        await dispatch(
          updateVisitThunk({
            id: selectedVisit._id,
            payload: {
              status: "CHECKED_OUT",
              feedback: {
                comment: feedbackText || "Audio Feedback Provided",
                rating: 5,
              },
            },
          })
        ).unwrap();

        await dispatch(
          saveRecord({
            guestData: {
              guestName: selectedVisit.visitor.name,
              guestEmail: selectedVisit.visitor.email,
              guestCompany: selectedVisit.visitor.company,
              guestImgUri: selectedVisit.visitor.profileImgUri,
            },
            canvasPages: [],
            signaturePaths: [],
            visitType: selectedVisit.purpose || "General",
            feedbackText: feedbackText,
            audio: audioUri || undefined,
            image: imageUri || undefined,
          })
        ).unwrap();

        Alert.alert("Success", "Thank you for your feedback!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } catch (error) {
        console.error("Submission failed:", error);
        Alert.alert("Error", "Failed to submit feedback. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert("Error", "No active visit found.");
      router.replace("/");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="absolute inset-0 -z-10 opacity-50" pointerEvents="none">
        <Whitebg />
      </View>

      <SafeAreaView
        className="flex-1"
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mt-2">
              <Text className="text-3xl font-bold text-gray-900">
                Your Feedback
              </Text>
              <Text className="text-base text-gray-500 mt-1">
                Choose how you want to leave your feedback
              </Text>
            </View>

            {/* Redesigned Toggle */}
            <View className="bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
              <SegmentedButtons
                value={mode}
                onValueChange={(val) => setMode(val as "text" | "audio")}
                buttons={[
                  {
                    value: "text",
                    label: "Text",
                    icon: ({ color }) => <Type size={20} color={color} />,
                    style: { borderRadius: 12 },
                  },
                  {
                    value: "audio",
                    label: "Voice",
                    icon: ({ color }) => <Mic size={20} color={color} />,
                    style: { borderRadius: 12 },
                  },
                ]}
                theme={{
                  colors: {
                    secondaryContainer: "#ffffff",
                    onSecondaryContainer: "#10b981", // Emerald-500
                    outline: "transparent",
                  },
                }}
                style={{ backgroundColor: "transparent" }}
              />
            </View>

            {/* Content Area */}
            <View className="bg-white rounded-2xl p-6 border border-gray-200 min-h-[250px] shadow-sm justify-center">
              {mode === "text" ? (
                <TextInput
                  multiline
                  placeholder="Write your feedback here..."
                  style={styles.textInput}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  textAlignVertical="top"
                />
              ) : (
                <View className="items-center gap-6">
                  {audioUri ? (
                    <View className="w-full items-center gap-4">
                      <View className="bg-green-50 p-4 rounded-full">
                        <FileAudio size={48} color="#22c55e" />
                      </View>
                      <Text className="text-green-600 font-medium">
                        Audio Recorded
                      </Text>

                      <View className="flex-row gap-4 mt-2">
                        <TouchableOpacity
                          onPress={playSound}
                          disabled={isPlaying}
                          className="bg-blue-500 px-6 py-3 rounded-full flex-row items-center gap-2"
                        >
                          <Play size={20} color="white" />
                          <Text className="text-white font-semibold">
                            {isPlaying ? "Playing..." : "Play"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={deleteRecording}
                          className="bg-red-100 px-6 py-3 rounded-full flex-row items-center gap-2"
                        >
                          <Trash2 size={20} color="#ef4444" />
                          <Text className="text-red-500 font-semibold">
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text className="text-gray-500 text-center mb-4">
                        Tap the microphone to start recording your feedback
                      </Text>
                      <TouchableOpacity
                        onPress={recording ? stopRecording : startRecording}
                        className={`w-24 h-24 rounded-full items-center justify-center ${
                          recording ? "bg-red-500" : "bg-blue-500"
                        } shadow-lg`}
                      >
                        {recording ? (
                          <Square size={40} color="white" />
                        ) : (
                          <Mic size={40} color="white" />
                        )}
                      </TouchableOpacity>
                      <Text
                        className={`font-semibold text-lg ${
                          recording ? "text-red-500" : "text-blue-500"
                        }`}
                      >
                        {recording ? "Recording..." : "Tap to Record"}
                      </Text>
                    </>
                  )}
                </View>
              )}
            </View>

            {/* Image Picker Section */}
            <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Add a Photo (Optional)
              </Text>
              {imageUri ? (
                <View className="relative rounded-xl overflow-hidden h-48 w-full bg-gray-100">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setImageUri(null)}
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                  >
                    <X size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row gap-4">
                  <TouchableOpacity
                    onPress={handleTakePhoto}
                    className="flex-1 bg-blue-50 p-4 rounded-xl items-center gap-2 border border-blue-100"
                  >
                    <Camera size={24} color="#3b82f6" />
                    <Text className="text-blue-600 font-medium">Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleChooseFromGallery}
                    className="flex-1 bg-purple-50 p-4 rounded-xl items-center gap-2 border border-purple-100"
                  >
                    <ImageIcon size={24} color="#a855f7" />
                    <Text className="text-purple-600 font-medium">Gallery</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <View className="mb-8 mt-auto">
              {isSubmitting ? (
                <ActivityIndicator size="large" color="#10b981" />
              ) : (
                <ButtonUI text="Submit Feedback" onPress={handleSubmit} />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    minHeight: 200,
  },
});
