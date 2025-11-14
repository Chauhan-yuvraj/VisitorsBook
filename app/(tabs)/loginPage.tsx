import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { House } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/auth.slice";
import Background from "@/components/ui/background"; // your reusable background component
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");

  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.auth);

  const handleLogin = () => {
    dispatch(login({ username, password }));
    if (username === "admin" && password === "1234") {
      router.push("/(admin)/Options");
    } else Alert.alert("Error", "Invalid credentials");
  };

  return (
    <Background image={require("@/assets/images/bg2.jpg")} overlayOpacity={0.6}>
      <SafeAreaView className="flex-1">
        {/* Top Bar for Logo and Home Button */}
        <View className="flex-row justify-between items-center px-6 pt-2">
          {/* Logo (Top Left) */}
          <View>
            <Image
              source={require("@/assets/images/icon.png")}
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>

          {/* Home button (Top Right) */}
          <Pressable
            onPress={() => router.push("/")}
            className="bg-white/20 p-3 rounded-2xl active:opacity-70"
          >
            <House color="white" size={24} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center px-6"
        >
          {/* Header */}
          <Text className="text-4xl font-bold text-white text-center mb-10">
            GOC 11 RAPID (H)
          </Text>

          {/* Inputs */}
          <View className="w-full max-w-sm gap-y-4">
            <TextInput
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              className="bg-white/90 px-4 py-3 rounded-lg text-base text-black"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="bg-white/90 px-4 py-3 rounded-lg text-base text-black"
            />

            {/* Button */}
            <Pressable
              onPress={handleLogin}
              className="mt-6 bg-green-600 rounded-lg py-3 active:opacity-80"
            >
              <Text className="text-white text-lg font-semibold text-center uppercase">
                Login
              </Text>
            </Pressable>

            {error && (
              <Text className="text-red-500 mt-2 text-center">{error}</Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}
