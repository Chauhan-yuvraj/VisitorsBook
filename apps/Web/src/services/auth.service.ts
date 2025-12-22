import type { Employee } from "@/types/user";
import API from "./api";

export interface LoginResponse {
    success: boolean;
    message: string;
    user: Employee;
    accessToken: string;
}

export const authService = {

    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await API.post<LoginResponse>("/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    refresh: async (): Promise<{ accessToken: string }> => {
        const response = await API.post<{ accessToken: string }>("/auth/refresh");
        return response.data;
    },

    logout: async (): Promise<void> => {
        await API.post("/auth/logout");
    },

    getMe: async (): Promise<{ success: boolean; data: Employee }> => {
        const response = await API.get<{ success: boolean; data: Employee }>("/employees/me");
        return response.data;
    }
};

export const updatePassword = async (password: string): Promise<void> => {
    await API.patch(`/employees/me`, { password });
};