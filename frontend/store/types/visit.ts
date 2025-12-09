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
    status: 'scheduled' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
    isWalkIn: boolean;
    meetingMinutes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVisitPayload {
    visitorId: string;
    hostId: string;
    scheduledCheckIn: string;
    isWalkIn?: boolean;
    notes?: string;
}

export interface UpdateVisitPayload {
    scheduledCheckIn?: string;
    status?: 'scheduled' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
    meetingMinutes?: string;
    actualCheckIn?: string;
    actualCheckOut?: string;
    isWalkIn?: boolean;
}
