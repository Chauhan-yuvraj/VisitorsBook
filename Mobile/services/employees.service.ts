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

export const addEmployee = async (newEmployee: Partial<Employee> | FormData): Promise<Employee> => {
    try {
        console.log("newEmployee :-", newEmployee)
        const isFormData = newEmployee instanceof FormData;
        // Let the browser/adapter set the Content-Type with the boundary
        const config = isFormData ? { headers: { 'Content-Type': undefined } } : {};
        
        const response = await API.post<{ success: boolean; data: Employee }>('/employees', newEmployee, config as any);
        return response.data.data;
    } catch (error) {
        console.error('Failed to add employee:', error);
        throw error;
    }
}

export const updateEmployee = async (updatedEmployee: Employee | FormData, id?: string): Promise<Employee> => {
    try {
        const isFormData = updatedEmployee instanceof FormData;
        const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        
        // If FormData, we need the ID passed separately or extracted (but FormData extraction is async/messy)
        // So we'll require ID if it's FormData
        const employeeId = isFormData ? id : (updatedEmployee as Employee)._id;

        if (!employeeId) throw new Error("Employee ID is required for update");

        const response = await API.patch<{ success: boolean; data: Employee }>(`/employees/${employeeId}`, updatedEmployee, config);
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
