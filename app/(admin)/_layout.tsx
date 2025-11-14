import { Stack } from "expo-router";
import { Text } from "react-native";

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
        name="records"
        options={{
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
              Records
            </Text>
          ),
        }}
      />
    </Stack>
  );
}
