import { View, Alert } from "react-native"; // <-- Import Alert
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Background from "@/components/ui/background";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectGuestCard from "@/components/SelectGuestCard";
import ColorPalette from "@/components/colorPalette";
import SelectTool from "@/components/SelectTool";
import ButtonUI from "@/components/ui/button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawingCanvas, { DrawingCanvasRef } from "@/components/ui/DrawingCanavs";
import SignatureCanvas, {
  SignatureCanvasRef,
} from "@/components/SignatureCanvas";
import { saveRecord } from "@/store/slices/records.slice";
import { router, useNavigation } from "expo-router";

export default function CanvasScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { selectedGuest } = useAppSelector((state) => state.guest);

  const canvasRef = useRef<DrawingCanvasRef>(null);
  const signatureRef = useRef<SignatureCanvasRef>(null);

  const guest = selectedGuest || {
    name: "No Guest Selected",
    position: "Tap a guest to select",
    img: "https://via.placeholder.com/150",
  };

  // Canvas Control functions
  const undoLastPath = () => {
    canvasRef.current?.undo();
  };
  const clearCanvas = () => {
    canvasRef.current?.clear();
  };
  const redoPath = () => {
    canvasRef.current?.redo();
  };

  const handleSubmit = useCallback(async () => {
    const signaturePaths = signatureRef.current?.getSignature() || [];
    const hasSignature = signatureRef.current?.hasSignature();
    const canvasPages = canvasRef.current?.getAllPages();

    if (!selectedGuest || selectedGuest.name === "No Guest Selected") {
      Alert.alert("Action Required", "Please select a guest first.");
      return;
    }

    if (!hasSignature || signaturePaths?.length === 0) {
      Alert.alert("Action Required", "Please provide a signature.");
      return;
    }

    if (!canvasPages || canvasPages.length === 0) {
      // In a real scenario, you might only require a signature if the user drew nothing.
      // For this example, we proceed if signature exists.
    }

    const guestName = selectedGuest.name;

    // Dispatch the Redux thunk
    dispatch(
      saveRecord({
        guestData: {
          name: guestName,
          position: selectedGuest.position,
          img: selectedGuest.img,
        },
        canvasPages: canvasPages || [],
        signaturePaths: signaturePaths,
      })
    )
      .unwrap()
      .then(() => {
        console.log("Feedback successfully saved via Redux!");

        // 1. Clear UI immediately
        canvasRef.current?.clear();
        signatureRef.current?.clear();

        // 2. Show success message (Pop-up)
        Alert.alert(
          "Submission Successful!",
          `Thank you ${guestName} for your valuable feedback.`,
          [
            {
              text: "OK",
              // The action is typically triggered when the user presses OK,
              // but we will rely on the setTimeout for automatic navigation
            },
          ]
        );

        // 3. Navigate back to the home page after 2 seconds
        setTimeout(() => {
          router.replace("/");
        }, 2000); // 2000ms delay
      })
      .catch((error) => {
        console.error("Failed to save feedback record:", error);
        Alert.alert("Error", "Failed to save feedback. Please try again.");
      });
  }, [selectedGuest, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // Removed handleSubmit from options as we handle the button within the screen
    });
  }, [navigation, handleSubmit]);

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
                <SignatureCanvas ref={signatureRef} />
              </View>

              {/* Action Buttons: Submit */}
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