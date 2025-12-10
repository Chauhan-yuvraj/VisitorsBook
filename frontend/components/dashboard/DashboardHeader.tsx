import { View } from "react-native";
import React, { useState } from "react";
import SearchInput from "@/components/ui/Input.ui";
import ButtonUI from "@/components/ui/button";
import { Plus } from "lucide-react-native";

export default function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="flex flex-row w-full justify-between px-4 ">
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        containerClassName="web:min-w-[200px]"
        style={{ width: 550 }}
      />
      <ButtonUI
        text="Add Visitor"
        iconSize={24}
        color="white"
        borderColor="black"
        textColor="black"
        LucideIcon={Plus}
        onPress={() => {}}
      />
    </View>
  );
}
