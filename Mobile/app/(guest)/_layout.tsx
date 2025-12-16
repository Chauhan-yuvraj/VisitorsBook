import { Stack } from "expo-router";
import { Text } from "react-native";

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
        name="selectVisit"
        options={{
          title: "Select Visit",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </Stack>
  );
}
