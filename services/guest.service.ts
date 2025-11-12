import { Guest } from "@/store/types/guest.type";
import { Storage } from 'expo-storage'

const STORAGE_KEY = 'guest_list';


/**
 * Reads the guest list from Expo Storage.
 * Handles parsing the JSON string back into a Guest array.
 */
export const getStoredGuests = async (): Promise<Guest[]> => {
    try {
        // Use ExpoStorage.getItem
        const data = await Storage.getItem({ key: STORAGE_KEY });

        if (data) {
            // Data retrieved from storage is a string, must be parsed
            return JSON.parse(data) as Guest[];
        }
        return [];
    } catch (e) {
        console.error("Error reading Expo Storage:", e);
        return []; // Return empty array on failure
    }
};

/**
 * Writes the current guest list array to Expo Storage.
 * Handles stringifying the Guest array for storage.
 */
export const setStoredGuests = async (guests: Guest[]): Promise<void> => {
    try {
        const dataToStore = JSON.stringify(guests);
        await Storage.setItem({ key: STORAGE_KEY, value: dataToStore });
    } catch (e) {
        console.error("Error writing Expo Storage:", e);
    }
};