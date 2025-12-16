// components/ParallaxRow.tsx
import {
  Animated,
  View,
  Pressable,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

const DATA: ImageSourcePropType[] = [
  require("@/assets/images/bg.jpg"),
  require("@/assets/images/bg.jpg"),
  require("@/assets/images/bg.jpg"),
  require("@/assets/images/bg.jpg"),
  require("@/assets/images/bg.jpg"),
];

const ITEM_WIDTH = 500;
const ITEM_MARGIN_RIGHT = 16;
const SCROLL_STEP = ITEM_WIDTH + ITEM_MARGIN_RIGHT;

export default function ParallaxRow() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * SCROLL_STEP,
      animated: true,
    });
  };

  const handleScroll = (direction: "left" | "right") => {
    const next =
      direction === "right"
        ? Math.min(DATA.length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);

    if (next !== currentIndex) {
      setCurrentIndex(next);
      scrollToIndex(next);
    }
  };

  return (
    <View>
      {/* Navigation */}
      <View className="flex flex-row gap-2 justify-end p-4">
        <Pressable
          onPress={() => handleScroll("left")}
          disabled={currentIndex === 0}
          className={`
            border border-green-500 rounded-full p-2 active:bg-green-100
            ${currentIndex === 0 ? "opacity-40" : ""}
          `}
        >
          <ArrowLeft color="#12945E" />
        </Pressable>

        <Pressable
          onPress={() => handleScroll("right")}
          disabled={currentIndex === DATA.length - 1}
          className={`
            border border-green-500 rounded-full p-2 active:bg-green-100
            ${currentIndex === DATA.length - 2 ? "opacity-40" : ""}
          `}
        >
          <ArrowRight color="#12945E" />
        </Pressable>
      </View>

      {/* Carousel */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      >
        {DATA.map((src, index) => {
          // Parallax effect per image
          const inputRange = [
            (index - 1) * SCROLL_STEP,
            index * SCROLL_STEP,
            (index + 1) * SCROLL_STEP,
          ];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-50, 0, 50],
            extrapolate: "clamp",
          });

          return (
            <View
              key={index}
              style={{ width: ITEM_WIDTH, marginRight: ITEM_MARGIN_RIGHT }}
              className="overflow-hidden"
            >
              <Animated.Image
                source={src}
                resizeMode="cover"
                style={{
                  width: ITEM_WIDTH + 60,
                  height: 250,
                  transform: [{ translateX }],
                }}
              />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
