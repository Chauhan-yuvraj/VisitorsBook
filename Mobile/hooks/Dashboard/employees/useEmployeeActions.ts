import { useAppDispatch } from "@/store/hooks";
import { addEmployeeThunk, deleteEmployeeThunk, fetchEmployeesThunk, updateEmployeeThunk } from "@/store/slices/employees.slice";
import { Employee } from "@/store/types/user";
import { Alert } from "react-native";

export const useEmployeeActions = (onSuccess?: () => void) => {
    const dispatch = useAppDispatch();

    const handleCreate = async (data: Partial<Employee> | FormData) => {
        try {
            await dispatch(addEmployeeThunk(data)).unwrap();
            dispatch(fetchEmployeesThunk());
            onSuccess?.();
            Alert.alert("Success", "Employee added successfully");
        } catch (error) {
            Alert.alert("Error", error as string);
        }
    };

    const handleUpdate = async (id: string, data: Partial<Employee> | FormData) => {
        try {
            await dispatch(updateEmployeeThunk({ id, data })).unwrap();
            dispatch(fetchEmployeesThunk());
            onSuccess?.();
            Alert.alert("Success", "Employee updated successfully");
        } catch (error) {
            Alert.alert("Error", error as string);
        }
    };

    const handleDelete = (employee: Employee) => {
        Alert.alert(
            "Delete Employee",
            `Are you sure you want to delete ${employee.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await dispatch(deleteEmployeeThunk(employee._id)).unwrap();
                            // Also mark as inactive if needed, but delete usually implies removal or soft delete handled by backend
                            // If backend requires explicit update to inactive:
                            // await dispatch(updateEmployeeThunk({ ...employee, isActive: false }));
                            
                            dispatch(fetchEmployeesThunk());
                            Alert.alert("Success", "Employee deleted successfully");
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
