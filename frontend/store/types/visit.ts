export interface VisitSnapshot {
    id: string;
    name: string;
    email?: string;
    profileImgUri?: string;
    company?: string;
    isVip?: boolean;
    department?: string;
}

export interface Visit {
    _id: string;
    visitor: VisitSnapshot;
    host: VisitSnapshot;
    scheduledCheckIn: string;
    actualCheckIn?: string;
    actualCheckOut?: string;
    status: 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'DECLINED' | 'MISSED';
    isWalkIn: boolean;
    purpose?: string;
    meetingMinutes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVisitPayload {
    visitorId: string;
    hostId: string;
    scheduledCheckIn: string;
    isWalkIn?: boolean;
    purpose?: string;
}

export interface UpdateVisitPayload {
    scheduledCheckIn?: string;
    status?: 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'DECLINED' | 'MISSED';
    meetingMinutes?: string;
    actualCheckIn?: string;
    actualCheckOut?: string;
    isWalkIn?: boolean;
    purpose?: string;
}
