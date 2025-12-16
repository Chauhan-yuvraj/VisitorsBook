import React from "react";
import { Button, ListIconProps } from "react-native-paper";
import { Text, View } from "react-native";

interface ButtonUIProps {
  text: string;
  icon?: ListIconProps["icon"]; // Paper icons
  LucideIcon?: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  iconSize?: number;
  color?: string;
  textColor?: string;
  onPress?: () => void;
  borderColor?: string;
  borderWidth?: number;
}

export default function ButtonUI({
  text,
  icon,
  LucideIcon,
  iconSize = 18,
  color,
  textColor = "#ffffff",
  onPress,
  borderColor = "black",
  borderWidth = 1,
}: ButtonUIProps) {
  return (
    <Button
      className="flex flex-row "
      mode="contained"
      icon={icon} // Paper icon works natively
      buttonColor={color || "#10b981"}
      textColor={textColor}
      style={{
        borderRadius: 8,
        paddingVertical: 4,
        elevation: 5,
        borderColor,
        borderWidth,
      }}
      labelStyle={{ fontSize: 16, fontWeight: "600" }}
      onPress={onPress}
    >
      <View className="flex flex-row gap-x-4">
        {LucideIcon && (
          <View className="">
            <LucideIcon size={iconSize} color={textColor} strokeWidth={2} />
          </View>
        )}
        <Text>{text}</Text>
      </View>
    </Button>
  );
}
