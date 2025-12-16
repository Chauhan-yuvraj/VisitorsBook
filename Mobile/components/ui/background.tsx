import React, { ReactNode } from "react";
import { Image, View, ImageSourcePropType } from "react-native";

interface BackgroundProps {
  image: ImageSourcePropType;
  overlayOpacity?: number;
  children: ReactNode;
}

export default function Background({
  image,
  overlayOpacity = 0.6,
  children,
}: BackgroundProps) {
  return (
    <View className="flex-1">
      <Image
        source={image}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <View
        className="absolute w-full h-full bg-black"
        style={{ opacity: overlayOpacity }}
      />
      {children}
    </View>
  );
}
