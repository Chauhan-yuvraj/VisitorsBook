import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Mic, Square, Play, Trash2, FileAudio } from 'lucide-react-native';
import { Audio } from 'expo-av';

interface AudioRecorderViewProps {
  recording: Audio.Recording | undefined;
  audioUri: string | null;
  isPlaying: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  playSound: () => void;
  deleteRecording: () => void;
}

export function AudioRecorderView({
  recording,
  audioUri,
  isPlaying,
  startRecording,
  stopRecording,
  playSound,
  deleteRecording
}: AudioRecorderViewProps) {
  return (
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
  );
}
