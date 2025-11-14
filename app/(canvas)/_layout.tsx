import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function CanvasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Canvas"
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
              Provide your Valuable Feedback
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(guest)/CreateGuest")}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="add-circle-outline" size={30} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
