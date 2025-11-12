import { Stack } from "expo-router";
import { Text } from "react-native";

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
          // --- ADD BUTTON HERE ---
          //   headerRight: () => (
          //     <TouchableOpacity
          //       // Navigate to the create guest screen
          //       // Assuming your file path is (guest)/createGuest.tsx
          //       onPress={() => router.push("/(guest)/CreateGuest")}
          //       style={{ marginRight: 15 }}
          //     >
          //       {/* Use a simple plus icon */}
          //       <Ionicons name="add-circle-outline" size={30} color="#000" />
          //     </TouchableOpacity>
          //   ),
          // ------------------------
        }}
      />
    </Stack>
  );
}
