import API from "./api";
import { CreateDeliveryPayload, Delivery } from "@/store/types/delivery";

export const getDeliveries = async (): Promise<Delivery[]> => {
    const response = await API.get("/deliveries");
    return response.data;
};

export const createDelivery = async (data: CreateDeliveryPayload): Promise<Delivery> => {
    const response = await API.post("/deliveries", data);
    return response.data;
};

export const updateDeliveryStatus = async (id: string, status: string): Promise<Delivery> => {
    const response = await API.put(`/deliveries/${id}/status`, { status });
    return response.data;
};
