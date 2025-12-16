import { useAppDispatch } from "@/store/hooks";
import { scheduleVisitThunk, updateVisitThunk, deleteVisitThunk } from "@/store/slices/visit.slice";
import { CreateVisitPayload, Visit } from "@/store/types/visit";
import { Alert } from "react-native";

export const useVisitActions = (onSuccess?: () => void) => {
    const dispatch = useAppDispatch();

    const handleCreate = async (data: CreateVisitPayload) => {
        try {
            await dispatch(scheduleVisitThunk(data)).unwrap();
            onSuccess?.();
            Alert.alert("Success", "Visit scheduled successfully");
        } catch (error) {
            Alert.alert("Error", error as string);
        }
    };

    const handleUpdate = async (id: string, data: CreateVisitPayload & { status?: any }) => {
        try {
            await dispatch(updateVisitThunk({ 
                id, 
                payload: { 
                    scheduledCheckIn: data.scheduledCheckIn,
                    isWalkIn: data.isWalkIn,
                    purpose: data.purpose,
                    status: data.status
                } 
            })).unwrap();
            onSuccess?.();
            Alert.alert("Success", "Visit updated successfully");
        } catch (error) {
            Alert.alert("Error", error as string);
        }
    };

    const handleDelete = (visit: Visit) => {
        Alert.alert(
            "Delete Visit",
            "Are you sure you want to delete this visit?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await dispatch(deleteVisitThunk(visit._id)).unwrap();
                            Alert.alert("Success", "Visit deleted successfully");
                        } catch (error) {
                            Alert.alert("Error", error as string);
                        }
                    }
                }
            ]
        );
    };

    return { handleCreate, handleUpdate, handleDelete };
};
