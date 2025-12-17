import type { Employee } from "@/types/user";
import API from "./api";

interface EmployeeApiResponse {
  success: boolean;
  count: number;
  data: Employee[];
}

interface SingleEmployeeResponse {
  success: boolean;
  data: Employee;
}

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await API.get<EmployeeApiResponse>("/employees");
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
  const response = await API.post<SingleEmployeeResponse | Employee>("/employees", employeeData);
  // Handle both { data: Employee } and direct Employee response
  if ('data' in response.data && response.data.data) {
      return response.data.data;
  }
  return response.data as Employee;
};

export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
  const response = await API.put<SingleEmployeeResponse>(`/employees/${id}`, employeeData);
  return response.data.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await API.delete(`/employees/${id}`);
};

