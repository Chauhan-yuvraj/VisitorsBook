// components/SignatureCanvas.tsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

export interface PathData {
  path: SkPath;
  color: string;
  strokeWidth: number;
}

export interface SignatureCanvasRef {
  clear: () => void;
  getSignature: () => PathData[];
  hasSignature: () => boolean;
}

const SignatureCanvas = forwardRef<SignatureCanvasRef, object>((props, ref) => {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

  const startDrawing = (x: number, y: number) => {
    const newPath = Skia.Path.Make();
    newPath.moveTo(x, y);
    setCurrentPath(newPath);
  };

  const updateDrawing = (x: number, y: number) => {
    setCurrentPath((prev) => {
      if (!prev) return null;
      const newPath = prev.copy();
      newPath.lineTo(x, y);
      return newPath;
    });
  };

  const finishDrawing = () => {
    if (currentPath) {
      setPaths((prev) => [
        ...prev,
        {
          path: currentPath,
          color: "#000000", // Fixed signature color
          strokeWidth: 2,
        },
      ]);
      setCurrentPath(null);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      runOnJS(startDrawing)(event.x, event.y);
    })
    .onUpdate((event) => {
      runOnJS(updateDrawing)(event.x, event.y);
    })
    .onEnd(() => {
      runOnJS(finishDrawing)();
    });

  useImperativeHandle(ref, () => ({
    clear: () => {
      setPaths([]);
      setCurrentPath(null);
    },
    getSignature: () => paths,
    hasSignature: () => paths.length > 0,
  }));

  const handleClear = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Signature</Text>
        {paths.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.canvasWrapper}>
        <GestureDetector gesture={panGesture}>
          <Canvas style={styles.canvas}>
            {paths.map((pathData, index) => (
              <Path
                key={index}
                path={pathData.path}
                color="#000000"
                style="stroke"
                strokeWidth={2}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPath && (
              <Path
                path={currentPath}
                color="#000000"
                style="stroke"
                strokeWidth={2}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        </GestureDetector>

        {paths.length === 0 && !currentPath && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Sign here</Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  clearText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },
  canvasWrapper: {
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    position: "relative",
  },
  canvas: {
    flex: 1,
  },
  placeholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontStyle: "italic",
  },
});

SignatureCanvas.displayName = "SignatureCanvas";

export default SignatureCanvas;
