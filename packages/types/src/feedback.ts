export interface SerializablePathData {
    svg: string;
    color?: string;
    strokeWidth?: number;
}

export interface SerializableCanvasPage {
    id: string;
    paths: SerializablePathData[];
}

export interface UserRecord {
    guestName: string;
    guestImgUri?: string;
    guestPhone?: string;
    guestEmail?: string;
    guestCompany?: string;
    timestamp?: string;
    featured?: boolean;
}

export interface FeedbackRecord {
    _id?: string;
    id?: string;
    VisitorId?: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        company: string;
        profileImgUri?: string;
    };
    guest?: UserRecord;
    
    pages: SerializableCanvasPage[];
    signature: SerializablePathData[];
    
    // Mobile specific
    visitType?: string;
    timeStamp?: string;
    feedbackText?: string;
    audio?: string;
    images?: string[];
}
