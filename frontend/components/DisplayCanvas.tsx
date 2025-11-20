import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

// Assuming these types are defined in your project
import { SerializableCanvasPage, SerializablePathData } from '@/store/types/feedback'; 

interface DisplayCanvasProps {
  page: SerializableCanvasPage;
}

/**
 * Component to display a serialized canvas page by deserializing SVG strings
 * back into Skia paths for rendering.
 */
export default function DisplayCanvas({ page }: DisplayCanvasProps) {
  
  // Use useMemo to perform the expensive deserialization only when the 'page' prop changes.
  const renderedPaths = useMemo(() => {
    if (!page || !page.paths || page.paths.length === 0) {
      return [];
    }

    return page.paths.map((serializablePath: SerializablePathData, index: number) => {
      // --- CORE DESERIALIZATION STEP ---
      // Convert the SVG string back into a renderable SkPath object.
      const skPath = Skia.Path.MakeFromSVGString(serializablePath.svg);
      
      if (!skPath) {
        // Log an error if the path couldn't be reconstructed
        console.error("Failed to deserialize SVG path:", serializablePath.svg);
        return null;
      }

      // Render the Skia Path component using the reconstituted path and stored metadata
      return (
        <Path
          key={index}
          path={skPath}
          // Use stored color/width, falling back to safe defaults if missing
          color={serializablePath.color || 'black'} 
          style="stroke"
          strokeWidth={serializablePath.strokeWidth || 3} 
          strokeCap="round"
          strokeJoin="round"
        />
      );
    }).filter((p): p is React.ReactElement => p !== null); // Filter out any failed deserializations
  }, [page]);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {renderedPaths}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    // Ensure the canvas background is white, matching the original drawing surface
    backgroundColor: 'white',
  },
});