import { View } from "react-native";
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Background from "@/components/ui/background";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectGuestCard from "@/components/SelectGuestCard";
import ColorPalette from "@/components/colorPalette";
import SelectTool from "@/components/SelectTool";
import ButtonUI from "@/components/ui/button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawingCanvas, { DrawingCanvasRef } from "@/components/ui/DrawingCanavs"; // Corrected typo in import
import SignatureCanvas, {
  SignatureCanvasRef,
} from "@/components/SignatureCanvas"; // Import SignatureCanvasRef
import { saveRecord } from "@/store/slices/records.slice";

export default function CanvasScreen() {
  const dispatch = useAppDispatch(); // <-- Initialize dispatch
  const { selectedGuest } = useAppSelector((state) => state.guest);

  // Ref for the main drawing canvas
  const canvasRef = useRef<DrawingCanvasRef>(null);

  // NEW: Ref for the signature canvas
  const signatureRef = useRef<SignatureCanvasRef>(null);

  const guest = selectedGuest || {
    name: "No Guest Selected",
    position: "Tap a guest to select",
    img: "https://via.placeholder.com/150",
  };

  // Canvas Control functions (passed to SelectTool)
  const undoLastPath = () => {
    canvasRef.current?.undo();
  };
  const clearCanvas = () => {
    canvasRef.current?.clear();
  };
  const redoPath = () => {
    canvasRef.current?.redo();
  };

  const handleSubmit = async () => {
    const signaturePaths = signatureRef.current?.getSignature() || [];
    const hasSignature = signatureRef.current?.hasSignature();
    const canvasPages = canvasRef.current?.getAllPages();

    if (!selectedGuest || selectedGuest.name === "No Guest Selected") {
      console.warn("Submission failed: Please select a guest first.");
      return;
    }

    if (!hasSignature || signaturePaths?.length === 0) {
      console.warn("Submission failed: Please provide a signature.");
      return;
    }

    if (!canvasPages || canvasPages.length === 0) {
      console.warn("Submission failed: Canvas pages data is missing.");
      return;
    }

    // Dispatch the Redux thunk to handle serialization and saving
    dispatch(
      saveRecord({
        guestData: {
          name: selectedGuest.name,
          position: selectedGuest.position,
        },
        canvasPages: canvasPages,
        signaturePaths: signaturePaths,
      })
    )
      .unwrap() // Handle the promise result for success/failure feedback
      .then(() => {
        console.log("Feedback successfully saved via Redux!");
        // Clear UI after successful save
        canvasRef.current?.clear();
        signatureRef.current?.clear();
      })
      .catch((error) => {
        console.error("Failed to save feedback record:", error);
      });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Background image={require("@/assets/images/background.jpg")}>
        <SafeAreaView className="flex-1 p-6">
          <View className="flex-1 flex-row gap-4">
            {/* Left Column */}
            <View className="flex-1 gap-y-6">
              <View>
                <SelectGuestCard guest={guest} />
              </View>

              <View className="bg-white/10 p-1 rounded-lg">
                <ColorPalette />
              </View>

              {/* Tool Selection (includes Undo/Clear/Redo for DrawingCanvas) */}
              <View className="bg-white/10 rounded-lg">
                <SelectTool
                  onUndo={undoLastPath}
                  onClear={clearCanvas}
                  onRedo={redoPath}
                />
              </View>

              {/* Signature Canvas */}
              <View>
                {/* Pass the new ref to the SignatureCanvas */}
                <SignatureCanvas ref={signatureRef} />
              </View>

              {/* Action Buttons: Only Submit remains */}
              <View className="gap-y-2">
                <ButtonUI text="Submit" onPress={handleSubmit} />
              </View>
            </View>

            {/* Right Column - Drawing Canvas */}
            <View className="flex-[3] bg-white rounded-2xl overflow-hidden border border-white/20">
              <DrawingCanvas ref={canvasRef} />
            </View>
          </View>
        </SafeAreaView>
      </Background>
    </GestureHandlerRootView>
  );
}
