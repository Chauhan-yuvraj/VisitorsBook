import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import Whitebg from "@/assets/background-pattern/Whitebg";
import ButtonUI from "@/components/ui/button";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useFeedbackSubmit } from "@/hooks/useFeedbackSubmit";

import { FeedbackToggle } from "@/components/canvas/FeedbackToggle";
import { AudioRecorderView } from "@/components/canvas/AudioRecorderView";
import { ImageAttachment } from "@/components/canvas/ImageAttachment";

export default function CanvasScreen() {
  const [mode, setMode] = useState<"text" | "audio">("audio");
  const [feedbackText, setFeedbackText] = useState("");
  const [imageUris, setImageUris] = useState<string[]>([]);

  // Custom Hooks
  const {
    recording,
    audioUri,
    isPlaying,
    startRecording,
    stopRecording,
    playSound,
    deleteRecording
  } = useAudioRecorder();

  const { isSubmitting, submitFeedback } = useFeedbackSubmit();

  const { handleTakePhoto, handleChooseFromGallery } = useImagePicker((uri) => {
    if (uri) {
      setImageUris((prev) => [...prev, uri]);
    }
  });

  const handleSubmit = () => {
    submitFeedback(feedbackText, audioUri, imageUris);
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

            {/* Toggle */}
            <FeedbackToggle mode={mode} setMode={setMode} />

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
                <AudioRecorderView
                  recording={recording}
                  audioUri={audioUri}
                  isPlaying={isPlaying}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  playSound={playSound}
                  deleteRecording={deleteRecording}
                />
              )}
            </View>

            {/* Image Picker Section */}
            <ImageAttachment
              imageUris={imageUris}
              setImageUris={setImageUris}
              handleTakePhoto={handleTakePhoto}
              handleChooseFromGallery={handleChooseFromGallery}
            />

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
