import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useEmployees } from '@/hooks/useEmployees';
import { useMeetings } from '@/hooks/useMeetings';
import { isSlotInPast } from '@/utils/timeSlots';
import type { Meeting, MeetingTimeSlot } from '@/types/meeting';
import type { RootState } from '@/store/store';
import type { MeetingWizardStep, MeetingWizardFormData } from '@/constants/meetingWizard';
import { validateMeetingWizardStep, canProceedToNextStep } from '@/utils/meetingWizard';

interface UseMeetingWizardProps {
  isOpen: boolean;
  meetingToEdit?: Meeting | null;
}

export const useMeetingWizard = ({ isOpen, meetingToEdit }: UseMeetingWizardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { employees } = useEmployees();
  const { createMeeting, updateMeeting } = useMeetings();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<MeetingWizardStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<MeetingTimeSlot[]>([]);

  // Form data
  const [formData, setFormData] = useState<MeetingWizardFormData>({
    title: "",
    hostId: "",
    participants: [],
    location: "",
    isVirtual: false,
    agenda: "",
    remarks: "",
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      if (meetingToEdit) {
        // Populate form for editing
        setFormData({
          title: meetingToEdit.title || "",
          hostId: meetingToEdit.host || "",
          participants: meetingToEdit.participants || [],
          location: meetingToEdit.location || "",
          isVirtual: meetingToEdit.isVirtual || false,
          agenda: meetingToEdit.agenda || "",
          remarks: meetingToEdit.remarks || "",
        });
        // Set selected slots from existing meeting
        setSelectedSlots(meetingToEdit.timeSlots || []);
        if (meetingToEdit.timeSlots.length > 0) {
          setSelectedDate(new Date(meetingToEdit.timeSlots[0].date));
        }
      } else {
        // Reset form for new meeting
        setFormData({
          title: "",
          hostId: user?._id || "",
          participants: [],
          location: "",
          isVirtual: false,
          agenda: "",
          remarks: "",
        });
        setSelectedSlots([]);
        setSelectedDate(new Date());
      }
    }
  }, [isOpen, meetingToEdit, user]);

  // Form handlers
  const updateFormData = (updates: Partial<MeetingWizardFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value } as Partial<MeetingWizardFormData>);
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    updateFormData({ [name]: value } as Partial<MeetingWizardFormData>);
  };

  const handleParticipantToggle = (participantId: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(participantId)
        ? prev.participants.filter(id => id !== participantId)
        : [...prev.participants, participantId]
    }));
  };

  const handleSlotSelect = (slot: { time: string; available: boolean; booked?: boolean }) => {
    if (!selectedDate) return;

    // Check if the slot is in the past
    if (isSlotInPast({ time: slot.time, available: slot.available, booked: slot.booked }, selectedDate)) {
      return; // Don't allow selection of past slots
    }

    // Convert time string (e.g., "9:30 AM") to ISO datetime strings
    const timeMatch = slot.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) {
      console.error('Invalid time format:', slot.time);
      return;
    }

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);

    const slotDateTime = {
      date: selectedDate.toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    setSelectedSlots(prev => {
      const exists = prev.some(s =>
        s.date === slotDateTime.date &&
        s.startTime === slotDateTime.startTime
      );
      if (exists) {
        return prev.filter(s =>
          !(s.date === slotDateTime.date && s.startTime === slotDateTime.startTime)
        );
      } else {
        return [...prev, slotDateTime];
      }
    });
  };

  // Navigation
  const handleNext = () => {
    if (canProceedToNextStep(currentStep, formData, selectedDate, selectedSlots) && currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as MeetingWizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as MeetingWizardStep);
    }
  };

  // Validation
  const isCurrentStepValid = validateMeetingWizardStep(currentStep, formData, selectedDate, selectedSlots);

  // Submit
  const handleSubmit = async () => {
    if (!user?._id || selectedSlots.length === 0) return;

    setIsLoading(true);
    try {
      const meetingData = {
        organizer: user._id,
        host: formData.hostId,
        participants: formData.participants,
        title: formData.title,
        agenda: formData.agenda,
        location: formData.location,
        isVirtual: formData.isVirtual,
        timeSlots: selectedSlots,
        remarks: formData.remarks,
      };

      let result;
      if (meetingToEdit) {
        result = await updateMeeting(meetingToEdit._id!, meetingData);
      } else {
        result = await createMeeting(meetingData);
      }

      return result;
    } catch (error) {
      console.error("Error saving meeting:", error);
      return { success: false, message: "Failed to save meeting" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    currentStep,
    isLoading,
    selectedDate,
    setSelectedDate,
    selectedSlots,
    formData,

    // Derived state
    isCurrentStepValid,
    user,
    employees,

    // Handlers
    updateFormData,
    handleInputChange,
    handleSelectChange,
    handleParticipantToggle,
    handleSlotSelect,
    handleNext,
    handleBack,
    handleSubmit,
  };
};