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
          <View className="flex justify-center items-center">
            <Text className="text-7xl font-bold text-center p-4">Login</Text>
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.95)", // outer edges strong white
                "rgba(255,255,255,0.50)",
                "rgba(255,255,255,0.30)",
                "rgba(255,255,255,0.00)", // perfect clear center
              ]}
              start={{ x: 0, y: 1 }} // fade from top
              end={{ x: 0, y: 0 }} // to bottom
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 5,
              }}
            />
          </View>
          <View className="flex flex-row justify-center items-center  ">
            <LoginForm />
          </View>
        </View>
      </SafeAreaView>
    </Background>
  );
}
