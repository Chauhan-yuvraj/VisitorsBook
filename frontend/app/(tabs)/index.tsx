import Background from "@/components/Background";
import Buttons from "@/components/Buttons";
import ParallaxRow from "@/components/ParallaxRow";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { User } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     console.log("Attempting to prefetch login page...");
  //     router.replace("/(admin)/Options");
  //   }, 100); // Wait r

  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <Background>
      <SafeAreaView className="flex-1 w-full">
        <View className="flex flex-row justify-end rounded-full  p-8">
          <View className="border border-black rounded-full p-3 active:bg-black/10">
            <Pressable onPress={() => router.push("/(auth)/loginPage")}>
              <User color="#555" />
            </Pressable>
          </View>
        </View>
        {/* Main Content Area */}
        <View className="flex-1 justify-end  items-center w-full gap-y-12 px-4 ">
          <View>
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
            <Text className="text-8xl max-w-[700px] font-bold   p-4  text-center">
              Welcome to the Abhyuday Bharat
            </Text>
          </View>
          <View className="">
            <Buttons
              text="FeedBack"
              onClick={() => router.push("/(canvas)/Canvas")}
            />
          </View>
        </View>

        {/* Parallax Row */}
        <View className="">
          <ParallaxRow />
        </View>
      </SafeAreaView>
    </Background>
  );
}
