import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { X,  ChevronLeft, ChevronRight } from "lucide-react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { ThemedText } from "./themed-text"; // Assuming you have this component for text styling
import { FeedbackRecord } from "@/store/types/feedback";


interface RecordDetailModalProps {
  record: FeedbackRecord;
  visible: boolean;
  onClose: () => void;
}

// Skia requires paths to be SkPath objects, so we need to convert the stored SVG strings back.
const createSkPathFromSvg = (svgString: string) => {
  return Skia.Path.MakeFromSVGString(svgString);
};

const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  visible,
  onClose,
}) => {
  const [pageIndex, setPageIndex] = useState(0);

  if (!record) return null;

  const currentPage = record.pages[pageIndex];
  const totalPages = record.pages.length;

  const guestImageSource = { uri: record.guestImgUri };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          {/* Header and Close Button */}
          <View style={modalStyles.header}>
            <ThemedText style={modalStyles.headerText}>
              Feedback by {record.guestName}
            </ThemedText>
            <Pressable onPress={onClose} style={modalStyles.closeButton}>
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Guest Info */}
            <View style={modalStyles.guestInfo}>
              <Image source={guestImageSource} style={modalStyles.guestImage} />
              <View>
                <ThemedText type="subtitle" style={{ fontWeight: "bold" }}>
                  {record.guestPosition}
                </ThemedText>
                <ThemedText type="default">
                  Saved: {new Date(record.timestamp).toLocaleString()}
                </ThemedText>
              </View>
            </View>

            {/* Drawing Canvas Renderer */}
            <ThemedText style={modalStyles.sectionHeader}>
              Drawing Feedback (Page {pageIndex + 1} of {totalPages})
            </ThemedText>
            <View style={modalStyles.canvasWrapper}>
              <Canvas style={modalStyles.canvas}>
                {currentPage?.paths.map((pathData, index) => {
                  const path = createSkPathFromSvg(pathData.svg);
                  if (!path) return null;
                  return (
                    <Path
                      key={index}
                      path={path}
                      color={pathData.color || "#000000"}
                      style="stroke"
                      strokeWidth={pathData.strokeWidth || 5}
                      strokeCap="round"
                      strokeJoin="round"
                    />
                  );
                })}
              </Canvas>
            </View>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View style={modalStyles.pagination}>
                <Pressable
                  onPress={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex === 0}
                  style={
                    pageIndex === 0
                      ? modalStyles.pageDisabled
                      : modalStyles.pageActive
                  }
                >
                  <ChevronLeft
                    size={24}
                    color={pageIndex === 0 ? "#aaa" : "#000"}
                  />
                </Pressable>
                <ThemedText>
                  Page {pageIndex + 1} / {totalPages}
                </ThemedText>
                <Pressable
                  onPress={() =>
                    setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={pageIndex === totalPages - 1}
                  style={
                    pageIndex === totalPages - 1
                      ? modalStyles.pageDisabled
                      : modalStyles.pageActive
                  }
                >
                  <ChevronRight
                    size={24}
                    color={pageIndex === totalPages - 1 ? "#aaa" : "#000"}
                  />
                </Pressable>
              </View>
            )}

            {/* Signature Renderer */}
            <ThemedText style={modalStyles.sectionHeader}>Signature</ThemedText>
            <View style={modalStyles.signatureWrapper}>
              <Canvas style={modalStyles.signatureCanvas}>
                {record.signature.map((pathData, index) => {
                  const path = createSkPathFromSvg(pathData.svg);
                  if (!path) return null;
                  return (
                    <Path
                      key={index}
                      path={path}
                      color="#000000"
                      style="stroke"
                      strokeWidth={2}
                      strokeCap="round"
                      strokeJoin="round"
                    />
                  );
                })}
              </Canvas>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default RecordDetailModal;

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#F3F4F6", // Light gray background
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 5,
  },
  guestInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  guestImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#D1D5DB",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B5563",
    marginTop: 15,
    marginBottom: 10,
  },
  canvasWrapper: {
    width: "100%",
    aspectRatio: 1.5, // Maintain aspect ratio for canvas
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  signatureWrapper: {
    width: "100%",
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    overflow: "hidden",
  },
  signatureCanvas: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    gap: 20,
  },
  pageActive: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  pageDisabled: {
    padding: 8,
    opacity: 0.5,
  },
});
