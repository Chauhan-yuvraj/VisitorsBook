// components/CreateGuestButton.tsx

import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Move hook here

export default function CreateGuestButton() {
    const router = useRouter(); // Hook is now isolated inside this component

    return (
        <TouchableOpacity
            // Fix path: use lowercase 'createGuest' for the file system path
            // The file name is 'CreateGuest.tsx', so the Stack.Screen name should be 'CreateGuest'.
            // The Expo Router path for a screen named CreateGuest inside (guest) is /(guest)/CreateGuest
            onPress={() => router.push("/(guest)/selectGuest")} 
            style={{ marginRight: 15 }}
        >
            <Ionicons name="add-circle-outline" size={30} color="#000" />
        </TouchableOpacity>
    );
}