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
      return (
        (formData.scope === 'general' || formData.scope === 'departments' || formData.scope === 'separate') &&
        (formData.scope === 'departments' ? formData.departments.length > 0 : true)
      );
    case 2:
      return formData.hostId !== "" && formData.participants.length > 0;
    case 3:
      return formData.title.trim() !== "";
    case 4:
      return formData.location.trim() !== "";
    case 5:
      return selectedDate !== undefined;
    case 6:
      return selectedSlots.length > 0;
    case 7:
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
      if (!formData.scope) return "Please select meeting scope.";
      if (formData.scope === 'departments' && formData.departments.length === 0) return "Please select at least one department.";
      return null;
    case 2:
      if (!formData.hostId) return "Please select a host for the meeting.";
      if (formData.participants.length === 0) return "Please select at least one participant.";
      return null;
    case 3:
      return "Please enter a meeting title.";
    case 4:
      return `Please enter the ${formData.isVirtual ? "meeting link" : "location"}.`;
    case 5:
      return "Please select a date for the meeting.";
    case 6:
      return "Please select at least one time slot.";
    case 7:
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