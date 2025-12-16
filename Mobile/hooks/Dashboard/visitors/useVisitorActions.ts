import { useAppDispatch } from "@/store/hooks";
import { createGuestThunk, deleteGuestThunk, fetchGuestsThunk, updateGuestThunk } from "@/store/slices/guest.slice";
import { Visitor } from "@/store/types/visitor";
import { Alert } from "react-native";

export const useVisitorActions = (onSuccess?: () => void) => {
    const dispatch = useAppDispatch();

    const handleCreate = async (data: Partial<Visitor>) => {
        try {
            await dispatch(createGuestThunk(data)).unwrap();
            dispatch(fetchGuestsThunk());
            onSuccess?.();
            Alert.alert("Success", "Visitor added successfully");
        } catch (error) {
            Alert.alert("Error", error as string);
        }
    };

    const handleUpdate = async (id: string, data: Partial<Visitor>) => {
        try {
            await dispatch(updateGuestThunk({ ...data, _id: id } as Visitor)).unwrap();
            dispatch(fetchGuestsThunk());
            onSuccess?.();
            Alert.alert("Success", "Visitor updated successfully");
        } catch (error) {
            Alert.alert("Error", error as string);
        }
    };

    const handleDelete = (visitor: Visitor) => {
        Alert.alert(
            "Delete Visitor",
            `Are you sure you want to delete ${visitor.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await dispatch(deleteGuestThunk(visitor._id)).unwrap();
                            dispatch(fetchGuestsThunk());
                            Alert.alert("Success", "Visitor deleted successfully");
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
