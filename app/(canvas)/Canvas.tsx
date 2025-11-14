import { View } from "react-native";
import React, { useRef } from "react";
import { useAppSelector } from "@/store/hooks";
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

export default function CanvasScreen() {
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

  const handleSubmit = () => {
    // 1. Get drawing data from the main canvas
    const drawingPaths = canvasRef.current?.getPaths();

    // 2. Get signature data
    const signaturePaths = signatureRef.current?.getSignature();
    const hasSignature = signatureRef.current?.hasSignature();

    // Basic Validation: Ensure a signature exists
    if (!hasSignature || signaturePaths?.length === 0) {
      console.warn("Submission failed: Please provide a signature.");
      // In a real app, you would show a Toast or Alert here.
      return;
    }

    console.log("Submitting Feedback and Signature:");
    console.log("Guest:", selectedGuest?.name);
    console.log("Drawing Path Count:", drawingPaths?.length);
    console.log("Signature Path Count:", signaturePaths?.length);

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
