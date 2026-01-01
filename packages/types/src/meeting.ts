export interface Meeting {
  _id?: string;
  organizer: string; // User ID of the organizer
  host: string; // User ID of the host
  participants: string[]; // Array of user IDs
  scope: 'departments' | 'general' | 'separate'; // Meeting scope
  departments: string[]; // Array of department IDs (only used when scope is 'departments')
  title: string;
  agenda?: string;
  location?: string; // Physical location or meeting link
  isVirtual: boolean;
  timeSlots: MeetingTimeSlot[];
  remarks?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface MeetingTimeSlot {
  date: string; // ISO date string
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
}

export interface CreateMeetingRequest {
  organizer: string;
  host: string;
  participants: string[];
  scope: 'departments' | 'general' | 'separate'; // Meeting scope
  departments: string[]; // Only used when scope is 'departments'
  title: string;
  agenda?: string;
  location?: string;
  isVirtual: boolean;
  timeSlots: MeetingTimeSlot[];
  remarks?: string;
}

export interface ParticipantAvailability {
  userId: string;
  userName: string;
  isAvailable: boolean;
  reason?: string; // Reason why slot is booked (e.g., "Has another meeting", "On leave", etc.)
  conflictingMeeting?: {
    title: string;
    startTime: string;
    endTime: string;
  };
}