import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;           // allow tailwind/nativewind classes
  containerClassName?: string;  // optional wrapper styling
  style?: object;               // merge extra style if needed
}

const SearchInput = ({
  placeholder = "Search Visitor, Company...",
  value,
  onChangeText,
  className,
  containerClassName,
  style,
}: SearchInputProps) => {
  return (
    <View className={containerClassName}>
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[
          { backgroundColor: "#e9ecef" },
          style,
        ] as any}
        left={<TextInput.Icon icon="magnify" />}
        placeholderTextColor="#00000080"
        outlineColor="transparent"
        activeOutlineColor="transparent"
        // Lucide icons must still be wrapped manually if used later
        {...(className ? { className } : {})}  // apply only if passed
      />
    </View>
  );
};

export default SearchInput;
