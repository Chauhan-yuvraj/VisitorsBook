import { useCallback } from "react";
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker(onImageSelected: (uri: string | null) => void) {

    // TAKE PHOTO
    const handleTakePhoto = useCallback(async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (!status || status !== "granted") {
            alert("Permission required: Camera permission is needed.");
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });
            if (!result.canceled) {
                onImageSelected(result.assets[0].uri);
            } else {
                onImageSelected(null);
            }
        } catch (error) {
            console.error("Error taking photo:", error);
            onImageSelected(null);
        }
    }, [onImageSelected])

    const handleChooseFromGallery = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!status || status !== "granted") {
            alert("Permission required: Gallery permission is needed.");
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });
            if (!result.canceled) {
                onImageSelected(result.assets[0].uri);
            } else {
                onImageSelected(null);
            }
        } catch (error) {
            console.error("Error choosing image from gallery:", error);
            onImageSelected(null);
        }
    }, [onImageSelected])

    return {
        handleTakePhoto,
        handleChooseFromGallery,
    }
}
