import AsyncStorage from '@react-native-async-storage/async-storage';
import { CanvasPage } from "@/components/ui/DrawingCanavs"; // Multi-page structure
import { PathData as SignaturePathData } from "@/components/SignatureCanvas"; // Signature path structure
import { SkPath } from "@shopify/react-native-skia";
import { FeedbackRecord, SerializableCanvasPage, SerializablePathData } from '@/store/types/feedback';
import { STORAGE_KEY } from '@/constants/constant';


// --- HELPER FUNCTIONS FOR SERIALIZATION ---

// SkPath -> SVG string (Required for AsyncStorage)
const serializePath = (pathData: { path: SkPath, color?: string, strokeWidth?: number }): SerializablePathData => {
    return {
        svg: pathData.path.toSVGString(),
        color: pathData.color,
        strokeWidth: pathData.strokeWidth,
    };
};

// Signature Path -> SVG string (Signature only has 'path')
const serializeSignaturePath = (pathData: SignaturePathData): SerializablePathData => {
    return {
        svg: pathData.path.toSVGString(),
    };
};


// --- SERVICE FUNCTIONS ---
export async function getFeedbackRecords(): Promise<FeedbackRecord[]> {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Error reading feedback records from storage:", e);
        return [];
    }
}

export async function saveFeedbackRecord(
    guestData: { name: string, position: string, img: string },
    canvasPages: CanvasPage[],
    signaturePaths: SignaturePathData[]
): Promise<FeedbackRecord> {

    // 1. Serialize all Skia Path objects to SVG strings
    const serializablePages: SerializableCanvasPage[] = canvasPages.map(page => ({
        id: page.id,
        paths: page.paths.map(serializePath),
    }));

    const serializableSignature: SerializablePathData[] = signaturePaths.map(serializeSignaturePath);

    const newRecord: FeedbackRecord = {
        id: Date.now().toString(), // Unique ID based on timestamp
        guestName: guestData.name,
        guestPosition: guestData.position,
        guestImgUri: guestData.img,
        timestamp: new Date().toISOString(),
        pages: serializablePages,
        signature: serializableSignature,
    };

    // 2. Load existing records
    const existingRecords = await getFeedbackRecords();

    // 3. Save the updated list
    const updatedRecords = [...existingRecords, newRecord];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));

    return newRecord;
}

export async function deleteFeedbackRecord(id: string): Promise<boolean> {
    const existingRecords = await getFeedbackRecords();
    const updatedRecords = existingRecords.filter(record => record.id !== id);

    if (updatedRecords.length === existingRecords.length) {
        return false; // Record not found
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    return true;
}

export async function clearAllFeedbackRecords(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
}