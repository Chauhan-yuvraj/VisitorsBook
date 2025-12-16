import API from "./api";
import { Result } from "@/store/types/common";
import { Visit, CreateVisitPayload, UpdateVisitPayload } from "@/store/types/visit";

export  const getVisits = async (status?: string, hostId?: string): Promise<Result<Visit[]>> => {
    try {
        const params: any = {};
        if (status) params.status = status;
        if (hostId) params.hostId = hostId;

        const response = await API.get("/visits", { params });
        return { success: true, data: response.data.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to fetch visits",
        };
    }
};

export const getVisitById = async (id: string): Promise<Result<Visit>> => {
    try {
        const response = await API.get(`/visits/${id}`);
        return { success: true, data: response.data.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to fetch visit details",
        };
    }
};

export const scheduleVisit = async (payload: CreateVisitPayload): Promise<Result<Visit>> => {
    try {
        const response = await API.post("/visits", payload);
        return { success: true, data: response.data.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to schedule visit",
        };
    }
};

export const updateVisit = async (id: string, payload: UpdateVisitPayload): Promise<Result<Visit>> => {
    try {
        const response = await API.patch(`/visits/${id}`, payload);
        return { success: true, data: response.data.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to update visit",
        };
    }
};

export const deleteVisit = async (id: string): Promise<Result<void>> => {
    try {
        await API.delete(`/visits/${id}`);
        return { success: true, data: undefined };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || "Failed to delete visit",
        };
    }
};
