import { View } from "react-native";
import Whitebg from "@/assets/background-pattern/Whitebg";
import { LinearGradient } from "expo-linear-gradient";

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1 }}>
      {/* Background grid */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Whitebg />
      </View>

      {/* White shading overlay */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.95)", // outer edges strong white
          "rgba(255,255,255,0.30)",
          "rgba(255,255,255,0.00)",
          "rgba(255,255,255,0.00)", // perfect clear center
        ]}
        start={{ x: 0, y: 0 }} // fade from top
        end={{ x: 0, y: 1 }} // to bottom
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
        }}
      />
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.95)", // outer edges strong white
          "rgba(255,255,255,0.30)",
          "rgba(255,255,255,0.00)",
          "rgba(255,255,255,0.00)", // perfect clear center
        ]}
        start={{ x: 0, y: 1 }} // fade from top
        end={{ x: 0, y: 0 }} // to bottom
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
        }}
      />
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.95)", // outer edges strong white
          "rgba(255,255,255,0.50)",
          "rgba(255,255,255,0.30)",
          "rgba(255,255,255,0.00)", // perfect clear center
        ]}
        start={{ x: 1, y: 0 }} // fade from top
        end={{ x: 0, y: 0 }} // to bottom
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
        }}
      /> 
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.95)", // outer edges strong white
          "rgba(255,255,255,0.50)",
          "rgba(255,255,255,0.30)",
          "rgba(255,255,255,0.00)", // perfect clear center
        ]}
        start={{ x: 0, y: 0 }} // fade from top
        end={{ x: 1, y: 0 }} // to bottom
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
        }}
      />

      {/* Content */}
      <View style={{ flex: 1, zIndex: 10 }}>{children}</View>
    </View>
  );
}
