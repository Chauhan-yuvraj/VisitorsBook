import { View, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Pressable
        className="flex-1"
        onPress={() => router.push("/landingPage")} // navigates to app/next.tsx
      >
        <Image
          source={require("@/assets/images/bg.jpg")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Pressable>
    </View>
  );
}
