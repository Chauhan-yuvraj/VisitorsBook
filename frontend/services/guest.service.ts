import { Visitor } from "@/store/types/visitor";
import API from "./api";

interface VisitorApiResponse {
    success: boolean;
    count: number;
    data: Visitor[];
}

interface SingleVisitorApiResponse {
    success: boolean;
    data: Visitor;
}

export const getVisitors = async (): Promise<Visitor[]> => {
    try {
        const response = await API.get<VisitorApiResponse>('/visitors');
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch visitors:', error);
        throw error;
    }
};

export const addVisitor = async (newVisitor: Partial<Visitor>): Promise<Visitor> => {
    try {
        const response = await API.post<SingleVisitorApiResponse>('/visitors', newVisitor);
        return response.data.data;
    } catch (error) {
        console.error('Failed to add visitor:', error);
        throw error;
    }
};

export const updateVisitor = async (updatedVisitor: Partial<Visitor> & { _id: string }): Promise<Visitor> => {
    try {
        const response = await API.patch<SingleVisitorApiResponse>(`/visitors/${updatedVisitor._id}`, updatedVisitor);
        return response.data.data;
    } catch (error) {
        console.error('Failed to update visitor:', error);
        throw error;
    }
};

export const deleteVisitor = async (visitorId: string): Promise<void> => {
    try {
        await API.delete(`/visitors/${visitorId}`);
    } catch (error) {
        console.error('Failed to delete visitor:', error);
        throw error;
    }
};

export const getVisitor = async (visitorId: string): Promise<Visitor> => {
    try {
        const response = await API.get<SingleVisitorApiResponse>(`/visitors/${visitorId}`);
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch visitor:', error);
        throw error;
    }
};