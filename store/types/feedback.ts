export interface FeedbackRecord {
    id: string;
    guestName: string;
    guestPosition: string;
    guestImgUri: string;
    timestamp: string; // ISO date string
    pages: SerializableCanvasPage[];
    signature: SerializablePathData[];
    featured?: boolean;
}

// --- TYPES FOR STORAGE ---

// Simplified SkPath storage structure (SkPath object is not JSON serializable)
export interface SerializablePathData {
    svg: string; // Storing SkPath as SVG string
    color?: string;
    strokeWidth?: number;
}

export interface SerializableCanvasPage {
    id: string;
    paths: SerializablePathData[];
    // UndonePaths are temporary and generally not saved permanently
}