export interface UserRecord {
    guestName: string;
    guestImgUri?: string;
    guestPhone?: string;
    guestEmail?: string;
    guestCompany?: string;
    featured?: boolean;
}
export interface FeedbackRecord {
    _id?: string;
    VisitorId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        company: string;
        profileImgUri?: string;
    };
    pages: SerializableCanvasPage[];
    signature: SerializablePathData[];
    visitType: string;
    timeStamp: string;
    feedbackText?: string;
    audio?: string;
    images?: string[];
}


// --- TYPES FOR STORAGE ---
export interface SerializablePathData {
    svg: string; // Storing SkPath as SVG string
    color?: string;
    strokeWidth?: number;
}

export interface SerializableCanvasPage {
    id: string;
    paths: SerializablePathData[];
}