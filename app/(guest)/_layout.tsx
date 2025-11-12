import { Stack } from "expo-router";
import { Text } from "react-native";
// Import the new button component
import CreateGuestButton from "@/components/CreateGuestButton"; 

export default function GuestLayout() {
  // REMOVE: const router = useRouter(); // NO LONGER NEEDED HERE

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
          // Use the isolated component here
          headerRight: () => <CreateGuestButton />, 
        }}
      />

      <Stack.Screen
        // FIX: Name MUST match the file name's exported component name or file name
        name="CreateGuest" 
        options={{
          headerTitle: "Add New Guest",
          headerRight: () => null,
        }}
      />
    </Stack>
  );
}