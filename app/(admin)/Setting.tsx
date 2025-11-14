import { View, Text, Platform, Alert } from "react-native";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRecords } from "@/store/slices/records.slice";
import { SafeAreaView } from "react-native-safe-area-context";
import Background from "@/components/ui/background";
import { FileText, XCircle,  } from "lucide-react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
// FIX: Import FileSystem functions from the legacy path to avoid deprecation error
import * as FileSystem from "expo-file-system/legacy";
// import { StorageAccessFramework } from "expo-file-system";
import ButtonUI from "@/components/ui/button";
import { FeedbackRecord } from "@/store/types/feedback";

export default function ExportScreen() {
  const { StorageAccessFramework } = FileSystem;
  const dispatch = useAppDispatch();
  const { records, status } = useAppSelector((state) => state.records);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedFolderUri, setSelectedFolderUri] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("Not selected");

  // Ensure records are loaded
  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRecords());
    }
  }, [status, dispatch]);

  // --- FOLDER SELECTION LOGIC ---
  const handleBrowseFolder = async () => {
    try {
      if (Platform.OS === "android") {
        // Request directory permissions using Storage Access Framework
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (!permissions.granted) {
          setError("Folder selection was cancelled");
          return;
        }

        // Store the directory URI
        setSelectedFolderUri(permissions.directoryUri);
        
        // Extract folder name for display
        const uriParts = permissions.directoryUri.split("%2F");
        const folderName = decodeURIComponent(uriParts[uriParts.length - 1] || "Selected Folder");
        setSelectedFolderName(folderName);
        
        Alert.alert(
          "Folder Selected",
          `Files will be saved to: ${folderName}`,
          [{ text: "OK" }]
        );
      } else if (Platform.OS === "ios") {
        // On iOS, we'll use the document directory and share dialog
        setSelectedFolderUri(FileSystem.documentDirectory || "");
        setSelectedFolderName("App Documents (via Share)");
        
        Alert.alert(
          "Save Location",
          "On iOS, you'll be able to choose the exact save location when the file is generated using the share dialog.",
          [{ text: "OK" }]
        );
      }
    } catch (err: any) {
      console.error("Folder selection error:", err);
      setError(`Failed to select folder: ${err.message}`);
    }
  };

  // --- PDF GENERATION LOGIC ---

  const generateHtmlForRecord = (record: FeedbackRecord) => {
    // 1. Build Canvas SVG Previews
    // Note: Joining all pages into one large SVG for simplification in PDF export preview.
    const drawingSvgPaths = record.pages
      .map((page) =>
        page.paths
          .map(
            (p) =>
              `<path d="${p.svg}" style="fill: none; stroke: ${
                p.color || "#000"
              }; stroke-width: ${
                p.strokeWidth || 5
              }; stroke-linecap: round; stroke-linejoin: round;" />`
          )
          .join("")
      )
      .join("");

    const signatureSvgPaths = record.signature
      .map(
        (p) =>
          `<path d="${p.svg}" style="fill: none; stroke: #000; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;" />`
      )
      .join("");

    // 2. Wrap SVGs in full SVG tags for rendering
    // Use a fixed viewBox size for scaling consistency in PDF
    const wrappedDrawingSvg = `<div style="border: 1px solid #ccc; margin-top: 5px; height: 300px; overflow: hidden;">
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" style="background: white;">${drawingSvgPaths}</svg>
        </div>`;

    const wrappedSignatureSvg = `<div style="border: 1px dashed #ccc; margin-top: 5px; height: 80px; width: 200px; overflow: hidden;">
            <svg width="100%" height="100%" viewBox="0 0 200 80" style="background: white;">${signatureSvgPaths}</svg>
        </div>`;

    // 3. Assemble HTML
    return `
            <div class="record-container" style="page-break-after: always; padding: 15px; border: 1px solid #eee; margin-bottom: 20px; font-family: sans-serif; background: #fff;">
                <div class="header" style="display: flex; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
                    <!-- Note: Image loading requires base64 or publicly accessible URL for Expo Print -->
                    <img src="${
                      record.guestImgUri
                    }" style="width: 50px; height: 50px; border-radius: 25px; margin-right: 15px; object-fit: cover;">
                    <div>
                        <h2 style="margin: 0; font-size: 18px;">${
                          record.guestName
                        }</h2>
                        <p style="margin: 0; font-size: 13px; color: #555;">${
                          record.guestPosition
                        }</p>
                    </div>
                </div>
                
                <p style="font-size: 11px; color: #777;">Date: ${new Date(
                  record.timestamp
                ).toLocaleString()}</p>

                <h3 style="margin-top: 15px; font-size: 14px;">Signature:</h3>
                ${wrappedSignatureSvg}

                <h3 style="margin-top: 20px; font-size: 14px;">Drawing Feedback (${
                  record.pages.length
                } Pages):</h3>
                ${wrappedDrawingSvg}
            </div>
        `;
  };

  const handleExportAll = async () => {
    if (records.length === 0 || status !== "succeeded") {
      setError("No records available to export.");
      return;
    }

    if (!selectedFolderUri) {
      setError("Please select a folder first by clicking 'Browse Folder'.");
      return;
    }

    setExportStatus("exporting");
    setError(null);

    // 1. Generate combined HTML for all records
    let allHtml =
      '<!DOCTYPE html><html><head><title>Visitor Data Export</title></head><body><h1 style="text-align: center; font-family: sans-serif;">Visitor Data Export</h1>';
    records.forEach((record) => {
      allHtml += generateHtmlForRecord(record);
    });
    allHtml += "</body></html>";

    try {
      // 2. Print the PDF
      const { uri } = await Print.printToFileAsync({
        html: allHtml,
        base64: false,
        width: 612,
        height: 792,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      });

      const filename = `Visitors_Data_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      if (Platform.OS === "android") {
        // 3. Use Storage Access Framework to save directly to selected folder
        const fileUri = await StorageAccessFramework.createFileAsync(
          selectedFolderUri,
          filename,
          "application/pdf"
        );

        // Read the PDF content
        const pdfContent = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Write to the selected location
        await StorageAccessFramework.writeAsStringAsync(
          fileUri,
          pdfContent,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        Alert.alert(
          "Success!",
          `PDF saved successfully to:\n${selectedFolderName}/${filename}`,
          [{ text: "OK" }]
        );

        setExportStatus("success");
      } else if (Platform.OS === "ios") {
        // 4. For iOS, copy to document directory and share
        const finalUri = `${selectedFolderUri}${filename}`;
        await FileSystem.copyAsync({ from: uri, to: finalUri });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(finalUri, {
            mimeType: "application/pdf",
            UTI: "com.adobe.pdf",
            dialogTitle: "Save PDF to your preferred location",
          });
        }

        setExportStatus("success");
      }
    } catch (e: any) {
      console.error("Export Error:", e);
      setError(`Export failed: ${e.message || "Unknown error"}`);
      setExportStatus("error");
    }
  };

  const getButtonText = () => {
    switch (exportStatus) {
      case "exporting":
        return "Generating PDF...";
      case "success":
        return "Export Successful!";
      case "error":
        return "Export Failed";
      default:
        return `Export All Records (${records.length})`;
    }
  };

  // const isButtonDisabled =
  //   status !== "succeeded" ||
  //   exportStatus === "exporting" ||
  //   records.length === 0;

  return (
    <Background image={require("@/assets/images/background.jpg")}>
      <SafeAreaView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-white mb-8 text-center">
          Export Visitor Data
        </Text>

        <View className="bg-white/10 p-5 rounded-xl gap-6">
          <View className="flex-row items-center gap-4 border-b border-gray-500/30 pb-4">
            <FileText size={32} color="#D1D5DB" />
            <Text className="text-white text-lg font-semibold flex-1">
              Export Settings
            </Text>
          </View>

          <View>
            <Text className="text-gray-300 mb-2">
              Total Records Loaded:{" "}
              <Text className="font-bold text-white">
                {status === "succeeded" ? records.length : "Loading..."}
              </Text>
            </Text>

            {/* Folder Selection Section */}
            <View className="mt-4 mb-4">
              <Text className="text-gray-300 mb-3 font-semibold">
                Save Location:
              </Text>
              
              <ButtonUI
                text="Browse Folder"
                onPress={handleBrowseFolder}
              />
              
              {selectedFolderUri && (
                <View className="mt-3 p-3 bg-green-600/20 border border-green-500 rounded-lg">
                  <Text className="text-green-400 text-sm font-semibold">
                    ✓ Selected: {selectedFolderName}
                  </Text>
                </View>
              )}
            </View>

            {error && (
              <View className="flex-row items-center p-3 mt-3 bg-red-600/20 border border-red-500 rounded-lg">
                <XCircle size={20} color="#EF4444" />
                <Text className="text-red-400 ml-2 flex-1 text-xs">
                  {error}
                </Text>
              </View>
            )}

            {exportStatus === "success" && (
              <Text className="text-green-400 mt-3 text-sm">
                Successfully generated file! Use the share dialog to save to
                your preferred location.
              </Text>
            )}

            <Text className="text-gray-400 text-sm mt-4">
              * Select a folder first, then the system will generate a PDF file
              containing all visitor data. You&apos;ll be able to save it to your
              preferred location (e.g., Files app, iCloud, Google Drive).
            </Text>
          </View>

          <ButtonUI
            text={getButtonText()}
            onPress={handleExportAll}
          />
        </View>
      </SafeAreaView>
    </Background>
  );
}