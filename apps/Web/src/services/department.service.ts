import type { IDepartment } from "@repo/types";
import API from "./api";

interface DepartmentApiResponse {
  success: boolean;
  data: IDepartment[];
}

interface SingleDepartmentResponse {
  success: boolean;
  data: IDepartment;
}

export const getDepartments = async (): Promise<IDepartment[]> => {
  try {
    const response = await API.get<DepartmentApiResponse>("/departments");
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
};

export const createDepartment = async (departmentData: Partial<IDepartment>): Promise<IDepartment> => {
  try {
    const response = await API.post<SingleDepartmentResponse>("/departments", departmentData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create department:", error);
    throw error;
  }
};

export const updateDepartment = async (id: string, departmentData: Partial<IDepartment>): Promise<IDepartment> => {
  try {
    const response = await API.put<SingleDepartmentResponse>(`/departments/${id}`, departmentData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to update department:", error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    await API.delete(`/departments/${id}`);
  } catch (error) {
    console.error("Failed to delete department:", error);
    throw error;
  }
};
