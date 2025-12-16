import { Employee } from "./user";

export interface Delivery {
    _id: string;
    recipientId: Employee;
    carrier: "DHL" | "FEDEX" | "UPS" | "AMAZON" | "FOOD" | "OTHER";
    labelPhotoUrl?: string;
    trackingNumber?: string;
    status: "PENDING" | "COLLECTED" | "RETURNED" | "REJECTED";
    createdAt: string;
    collectedAt?: string;
}

export interface CreateDeliveryPayload {
    recipientId: string;
    carrier: string;
    trackingNumber?: string;
    labelPhotoUrl?: string;
}
