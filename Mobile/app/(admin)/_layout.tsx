import { router, Stack } from "expo-router";
import { HomeIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Dashboard"
        options={{
          headerLeft: () => (
            <TouchableOpacity style={{ marginRight: 15 }}>
              <View className="border border-black rounded-full p-2 active:bg-black/10">
                <HomeIcon
                  size={24}
                  color="#555"
                  onPress={() => router.replace("/")}
                />
              </View>
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
              Dashboard
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="RecordDetailScreen"
        options={{
          headerLeft: () => (
            <TouchableOpacity style={{ marginRight: 15 }}>
              <View className="border border-black rounded-full p-2 active:bg-black/10">
                <HomeIcon
                  size={24}
                  color="#555"
                  onPress={() => router.replace("/")}
                />
              </View>
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
              Admin Options
            </Text>
          ),
        }}
      />
    </Stack>
  );
}
