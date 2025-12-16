// components/DrawingCanvas.tsx
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useAppSelector } from "@/store/hooks";

interface PathData {
  path: SkPath;
  color: string;
  strokeWidth: number;
}

export interface CanvasPage {
  id: string;
  paths: PathData[];
  undonePaths: PathData[];
}

export interface DrawingCanvasRef {
  clear: () => void;
  undo: () => void;
  redo: () => void;
  getAllPages: () => CanvasPage[];
  addNewPage: () => void;
  getCurrentPageNumber: () => number;
  getTotalPages: () => number;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef>((props, ref) => {
  const { selectedColor, selectedTool } = useAppSelector(
    (state) => state.canvas
  );

  // Multi-page state
  const [pages, setPages] = useState<CanvasPage[]>([
    { id: "page-1", paths: [], undonePaths: [] },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

  const isEraser = selectedTool === "eraser";

  const getStrokeWidth = () => {
    switch (selectedTool) {
      case "pen":
        return 3;
      case "brush":
        return 8;
      case "marker":
        return 12;
      case "eraser":
        return 20;
      default:
        return 5;
    }
  };

  const strokeWidth = getStrokeWidth();
  const currentPage = pages[currentPageIndex];

  const startDrawing = (x: number, y: number) => {
    // Clear redo history when starting new path
    setPages((prev) => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        undonePaths: [],
      };
      return updated;
    });

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
      setPages((prev) => {
        const updated = [...prev];
        updated[currentPageIndex] = {
          ...updated[currentPageIndex],
          paths: [
            ...updated[currentPageIndex].paths,
            {
              path: currentPath,
              color: isEraser ? "#FFFFFF" : selectedColor,
              strokeWidth: strokeWidth,
            },
          ],
        };
        return updated;
      });
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
      setPages((prev) => {
        const updated = [...prev];
        updated[currentPageIndex] = {
          ...updated[currentPageIndex],
          undonePaths: [
            ...updated[currentPageIndex].undonePaths,
            ...updated[currentPageIndex].paths,
          ],
          paths: [],
        };
        return updated;
      });
      setCurrentPath(null);
    },
    undo: () => {
      setPages((prev) => {
        const updated = [...prev];
        const page = updated[currentPageIndex];

        if (page.paths.length === 0) return prev;

        const lastPath = page.paths[page.paths.length - 1];
        updated[currentPageIndex] = {
          ...page,
          paths: page.paths.slice(0, -1),
          undonePaths: [lastPath, ...page.undonePaths],
        };
        return updated;
      });
    },
    redo: () => {
      setPages((prev) => {
        const updated = [...prev];
        const page = updated[currentPageIndex];

        if (page.undonePaths.length === 0) return prev;

        const pathToRedo = page.undonePaths[0];
        updated[currentPageIndex] = {
          ...page,
          paths: [...page.paths, pathToRedo],
          undonePaths: page.undonePaths.slice(1),
        };
        return updated;
      });
    },
    getAllPages: () => pages,
    addNewPage: () => {
      const newPage: CanvasPage = {
        id: `page-${pages.length + 1}`,
        paths: [],
        undonePaths: [],
      };
      setPages((prev) => [...prev, newPage]);
      setCurrentPageIndex(pages.length);
    },
    getCurrentPageNumber: () => currentPageIndex + 1,
    getTotalPages: () => pages.length,
  }));

  const handleAddPage = () => {
    const newPage: CanvasPage = {
      id: `page-${pages.length + 1}`,
      paths: [],
      undonePaths: [],
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const handlePageChange = (index: number) => {
    setCurrentPageIndex(index);
    setCurrentPath(null);
  };

  return (
    <View style={styles.container}>
      {/* Page Navigation */}
      <View style={styles.pageNavigation}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pageScroll}
        >
          {pages.map((page, index) => (
            <Pressable
              key={page.id}
              onPress={() => handlePageChange(index)}
              style={[
                styles.pageTab,
                currentPageIndex === index && styles.pageTabActive,
              ]}
            >
              <Text
                style={[
                  styles.pageTabText,
                  currentPageIndex === index && styles.pageTabTextActive,
                ]}
              >
                Page {index + 1}
              </Text>
            </Pressable>
          ))}

          <Pressable onPress={handleAddPage} style={styles.addPageButton}>
            <Text style={styles.addPageText}>+ Add Page</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <GestureDetector gesture={panGesture}>
          <Canvas style={styles.canvas}>
            {currentPage.paths.map((pathData, index) => (
              <Path
                key={index}
                path={pathData.path}
                color={pathData.color}
                style="stroke"
                strokeWidth={pathData.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPath && (
              <Path
                path={currentPath}
                color={isEraser ? "#FFFFFF" : selectedColor}
                style="stroke"
                strokeWidth={strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        </GestureDetector>
      </View>

      {/* Page Info */}
      <View style={styles.pageInfo}>
        <Text style={styles.pageInfoText}>
          Page {currentPageIndex + 1} of {pages.length}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageNavigation: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pageScroll: {
    flexDirection: "row",
  },
  pageTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  pageTabActive: {
    backgroundColor: "#3B82F6",
  },
  pageTabText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  pageTabTextActive: {
    color: "#FFFFFF",
  },
  addPageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderWidth: 1,
    borderColor: "#22C55E",
    borderStyle: "dashed",
  },
  addPageText: {
    fontSize: 14,
    color: "#22C55E",
    fontWeight: "600",
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  pageInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  pageInfoText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas;
