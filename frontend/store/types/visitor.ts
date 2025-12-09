export interface Visitor {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    profileImgUri?: string;
    isVip: boolean;
    isBlocked: boolean;
    notes?: string;
    organizationId?: string;
    companyNameFallback?: string;
    createdAt?: string;
    updatedAt?: string;
}
