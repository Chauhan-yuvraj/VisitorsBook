export const MEETING_WIZARD_STEPS = [
  { number: 1, title: "Host & Participants" },
  { number: 2, title: "Meeting Details" },
  { number: 3, title: "Meeting Type & Location" },
  { number: 4, title: "Date Selection" },
  { number: 5, title: "Time Slots" },
  { number: 6, title: "Review & Confirm" },
] as const;

export type MeetingWizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface MeetingWizardFormData {
  title: string;
  hostId: string;
  participants: string[];
  departments: string[]; // Selected departments
  location: string;
  isVirtual: boolean;
  agenda: string;
  remarks: string;
}