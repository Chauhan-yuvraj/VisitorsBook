// services/employees.service.ts
import { Employee } from "@/store/types/user";
import API from "./api";

// Define the shape of the API response wrapper
interface EmployeeApiResponse {
    success: boolean;
    count: number;
    data: Employee[];
}

export const getEmployees = async (): Promise<Employee[]> => {
    try {
        const response = await API.get<EmployeeApiResponse>('/employees');

        console.log("API Raw Response:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];

    } catch (error) {
        console.error('Failed to fetch employees:', error);
        throw error; // Throwing lets the Thunk catch the error
    }
}

export const addEmployee = async (newEmployee: Partial<Employee>): Promise<Employee> => {
    try {
        console.log("newEmployee :-", newEmployee)
        const response = await API.post<{ success: boolean; data: Employee }>('/employees', newEmployee);
        return response.data.data;
    } catch (error) {
        console.error('Failed to add employee:', error);
        throw error;
    }
}

export const updateEmployee = async (updatedEmployee: Employee): Promise<Employee> => {
    try {
        const response = await API.patch<{ success: boolean; data: Employee }>(`/employees/${updatedEmployee._id}`, updatedEmployee);
        return response.data.data;
    } catch (error) {
        console.error('Failed to update employee:', error);
        throw error;
    }
}

export const deleteEmployee = async (employeeId: string): Promise<void> => {
    try {
        await API.delete(`/employees/${employeeId}`);
    } catch (error) {
        console.error('Failed to delete employee:', error);
        throw error;
    }
}
