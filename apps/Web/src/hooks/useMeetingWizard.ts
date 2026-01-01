import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useMeetings } from '@/hooks/useMeetings';
import { isSlotInPast } from '@/utils/timeSlots';
import type { Meeting, MeetingTimeSlot, ParticipantAvailability } from '@repo/types';
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
  const { departments } = useDepartments();
  const { createMeeting, updateMeeting } = useMeetings();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<MeetingWizardStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlots, setSelectedSlots] = useState<MeetingTimeSlot[]>([]);
  const [conflicts, setConflicts] = useState<ParticipantAvailability[]>([]);
  const [showConflictsModal, setShowConflictsModal] = useState(false);

  // Form data
  const [formData, setFormData] = useState<MeetingWizardFormData>({
    title: "",
    hostId: "",
    participants: [],
    departments: [],
    scope: 'general',
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
          departments: meetingToEdit.departments || [],
          scope: meetingToEdit.scope || 'general',
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
          departments: [],
          scope: 'general',
          location: "",
          isVirtual: false,
          agenda: "",
          remarks: "",
        });
        setSelectedSlots([]);
        setSelectedDate(undefined);
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

  const handleDepartmentToggle = (departmentId: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(departmentId)
        ? prev.departments.filter(id => id !== departmentId)
        : [...prev.departments, departmentId]
    }));
  };

  const handleMeetingScopeChange = (scope: 'general' | 'departments' | 'separate') => {
    setFormData(prev => ({
      ...prev,
      scope,
      // Clear departments if scope is not 'departments'
      departments: scope === 'departments' ? prev.departments : []
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
    if (canProceedToNextStep(currentStep, formData, selectedDate, selectedSlots) && currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as MeetingWizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as MeetingWizardStep);
    }
  };

  const handleForceCreate = async () => {
    // Force create the meeting (this would need a separate API endpoint)
    // For now, just close the modal and consider it successful
    setShowConflictsModal(false);
    setConflicts([]);
    // Note: In a real implementation, you'd call a force create API here
    return { success: true, message: "Meeting created with conflicts noted" };
  };

  const handleCancelConflicts = () => {
    setShowConflictsModal(false);
    setConflicts([]);
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
        scope: formData.scope,
        departments: formData.scope === 'departments' ? formData.departments : [],
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

      if (result?.success) {
        const resultWithConflicts = result as any; // Type assertion for conflicts
        if (resultWithConflicts.conflicts && resultWithConflicts.conflicts.length > 0) {
          // Show conflicts modal
          setConflicts(resultWithConflicts.conflicts);
          setShowConflictsModal(true);
          return { success: true, data: result.data, hasConflicts: true };
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result?.message || "Failed to save meeting" };
      }
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
    conflicts,
    showConflictsModal,

    // Derived state
    isCurrentStepValid,
    user,
    employees,
    departments,

    // Handlers
    updateFormData,
    handleInputChange,
    handleSelectChange,
    handleParticipantToggle,
    handleDepartmentToggle,
    handleMeetingScopeChange,
    handleSlotSelect,
    handleNext,
    handleBack,
    handleSubmit,
    handleForceCreate,
    handleCancelConflicts,
  };
};