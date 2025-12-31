import type { MeetingWizardStep, MeetingWizardFormData } from '@/constants/meetingWizard';
import type { MeetingTimeSlot } from '@/types/meeting';

/**
 * Validates a specific step in the meeting wizard
 */
export const validateMeetingWizardStep = (
  step: MeetingWizardStep,
  formData: MeetingWizardFormData,
  selectedDate: Date | undefined,
  selectedSlots: MeetingTimeSlot[]
): boolean => {
  switch (step) {
    case 1:
      return formData.hostId !== "" && formData.participants.length > 0;
    case 2:
      return formData.title.trim() !== "";
    case 3:
      return formData.location.trim() !== "";
    case 4:
      return selectedDate !== undefined;
    case 5:
      return selectedSlots.length > 0;
    case 6:
      return true; // Review step always valid
    default:
      return false;
  }
};

/**
 * Gets validation error message for a step
 */
export const getStepValidationError = (
  step: MeetingWizardStep,
  formData: MeetingWizardFormData,
  selectedDate: Date | undefined,
  selectedSlots: MeetingTimeSlot[]
): string | null => {
  if (validateMeetingWizardStep(step, formData, selectedDate, selectedSlots)) {
    return null;
  }

  switch (step) {
    case 1:
      if (!formData.hostId) return "Please select a host for the meeting.";
      if (formData.participants.length === 0) return "Please select at least one participant.";
      return null;
    case 2:
      return "Please enter a meeting title.";
    case 3:
      return `Please enter the ${formData.isVirtual ? "meeting link" : "location"}.`;
    case 4:
      return "Please select a date for the meeting.";
    case 5:
      return "Please select at least one time slot.";
    case 6:
      return null;
    default:
      return null;
  }
};

/**
 * Checks if we can proceed to the next step
 */
export const canProceedToNextStep = (
  currentStep: MeetingWizardStep,
  formData: MeetingWizardFormData,
  selectedDate: Date | undefined,
  selectedSlots: MeetingTimeSlot[]
): boolean => {
  return validateMeetingWizardStep(currentStep, formData, selectedDate, selectedSlots);
};

/**
 * Formats selected time slots for display
 */
export const formatSelectedTimeSlots = (slots: MeetingTimeSlot[]): string[] => {
  return slots.map(slot =>
    `${new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  );
};