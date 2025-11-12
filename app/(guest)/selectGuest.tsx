// screens/selectGuest.tsx (Example Usage)
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import Background from "@/components/ui/background";
import GuestCard from "@/components/guestCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGuestsThunk,
  guestState,
  setSelectedGuest,
} from "@/store/slices/guest.slice";
import { Guest } from "@/store/types/guest.type";
import { AppDispatch } from "@/store/store";
import { router } from "expo-router";

export default function SelectGuest() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    guest: guests,
    loading,
    error,
    selectedGuest,
  } = useSelector((state: { guest: guestState }) => state.guest);

  // Load guests when the component mounts
  useEffect(() => {
    dispatch(fetchGuestsThunk());
  }, [dispatch]);

  const handleGuestSelection = (guest: Guest) => {
    dispatch(setSelectedGuest(guest));
    setTimeout(() => {
      router.push("/(canvas)/Canvas");
    }, 500);
    
    
  };

  if (loading === "pending" && guests.length === 0) {
    return (
      <Background image={require("@/assets/images/background.jpg")}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          className="flex-1 justify-center items-center"
        />
      </Background>
    );
  }

  return (
    <Background image={require("@/assets/images/background.jpg")}>
      <Text className="text-base  text-white p-6 pt-12">
        Current Guests : {guests.length}
      </Text>
      {error && <Text className="text-red-400 text-center p-4">{error}</Text>}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <View className="flex flex-row flex-wrap gap-8 p-4 justify-center">
          {guests.map((guest: Guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onSelect={handleGuestSelection}
              isSelected={selectedGuest?.id === guest.id}
            />
          ))}
        </View>
      </ScrollView>
    </Background>
  );
}
