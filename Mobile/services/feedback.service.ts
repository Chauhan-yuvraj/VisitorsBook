// src/services/feedback.service.ts
import { UserRecord, SerializableCanvasPage, SerializablePathData, FeedbackRecord } from '@/store/types/feedback';
import API from './api';

export async function saveUserRecord(
    guestData: UserRecord,
    canvasPages: SerializableCanvasPage[],
    signaturePaths: SerializablePathData[],
    visitType: string = 'general',
    feedbackText?: string,
    audio?: string,
    images?: string[]
): Promise<FeedbackRecord> {
    console.log('Starting API call to save user record...');

    try {
        const formData = new FormData();

        // Append simple fields
        formData.append('visitType', visitType);
        if (feedbackText) formData.append('feedbackText', feedbackText);

        // Append complex objects as JSON strings
        formData.append('guest', JSON.stringify(guestData));
        formData.append('pages', JSON.stringify(canvasPages));
        formData.append('signature', JSON.stringify(signaturePaths));

        // Append Audio File
        if (audio) {
            const filename = audio.split('/').pop() || 'audio.m4a';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `audio/${match[1]}` : `audio/m4a`;

            // @ts-ignore
            formData.append('audio', { uri: audio, name: filename, type });
        }

        // Append Image Files
        if (images && images.length > 0) {
            images.forEach((imageUri, index) => {
                const filename = imageUri.split('/').pop() || `image_${index}.jpg`;
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                // @ts-ignore
                formData.append('images', { uri: imageUri, name: filename, type });
            });
        }

        const response = await API.post("/records", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;

    } catch (e) {
        console.error("Failed to process user record serialization:", e);
        throw e;
    }
}