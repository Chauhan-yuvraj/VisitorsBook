import { View, Text } from "react-native";
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import Background from "@/components/Background";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function loginPage() {
  return (
    <Background>
      <SafeAreaView className="flex-1">
        <View className="flex w-full h-full items-center justify-center px-4 gap-y-6">
          {/* Header Section */}
          <View className="relative flex justify-center items-center p-6">
            {/* Gradient Background Layer */}
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.0)",
                "rgba(255,255,255,0.5)",
                "rgba(255,255,255,0.8)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 20,
              }}
            />

            {/* Text Layer (Now clearly visible on top) */}
            <Text className="text-7xl font-bold text-center text-black z-10">
              Login
            </Text>
          </View>

          {/* Form Section */}
          <View className="flex flex-row justify-center items-center">
            <LoginForm />
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}
