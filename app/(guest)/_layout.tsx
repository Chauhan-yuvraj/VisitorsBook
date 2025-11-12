import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import an icon library for a clean button

export default function GuestLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="selectGuest"
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
              Select the Guest
            </Text>
          ),
          // --- ADD BUTTON HERE ---
          headerRight: () => (
            <TouchableOpacity
              // Navigate to the create guest screen
              // Assuming your file path is (guest)/createGuest.tsx
              onPress={() => router.push("/(guest)/CreateGuest")}
              style={{ marginRight: 15 }}
            >
              {/* Use a simple plus icon */}
              <Ionicons name="add-circle-outline" size={30} color="#000" />
            </TouchableOpacity>
          ),
          // ------------------------
        }}
      />

      <Stack.Screen
        name="createGuest"
        options={{
          headerTitle: "Add New Guest",
          // Optionally hide the headerRight button on this screen
          headerRight: () => null,
          // You might want to customize the back button behavior/text here too
        }}
      />
    </Stack>
  );
}
