import { useState, useEffect } from 'react';
import {
  generateTimeSlots,
  canEditDate,
  canEditSlot as canEditSlotUtil,
  mergeSlotsWithData,
} from '@/utils/timeSlots';
import type { TimeSlot } from '@/utils/timeSlots';

interface UseTimeSlotsProps {
  selectedDate?: Date;
  onSlotsUpdate?: (slots: TimeSlot[]) => void;
  onSlotsData?: (slots: TimeSlot[]) => void;
  onSlotsChange?: (slots: TimeSlot[]) => void;
  availabilityData?: any[];
  meetingsData?: any[];
}

export const useTimeSlots = ({
  selectedDate,
  onSlotsUpdate,
  onSlotsData,
  onSlotsChange,
  availabilityData,
  meetingsData,
}: UseTimeSlotsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotsForEdit, setSelectedSlotsForEdit] = useState<Set<number>>(new Set());
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState('');
  const [pendingSlotIndices, setPendingSlotIndices] = useState<number[]>([]);

  // Check if slots can be edited (not past dates)
  const canEditSlots = (): boolean => {
    if (!selectedDate) return false;
    return canEditDate(selectedDate);
  };

  // Check if a specific slot can be edited
  const canEditSlot = (slot: TimeSlot): boolean => {
    if (!selectedDate) return false;
    return canEditSlotUtil(slot, selectedDate);
  };

  // Initialize slots when component mounts or date changes
  useEffect(() => {
    if (selectedDate) {
      const newSlots = generateTimeSlots();
      const mergedSlots = mergeSlotsWithData(newSlots, selectedDate, availabilityData, meetingsData);

      setSlots(mergedSlots);
      onSlotsData?.(mergedSlots);
      onSlotsChange?.(mergedSlots);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, availabilityData, meetingsData]);

  const handleSlotClick = (slot: TimeSlot, index: number) => {
    if (isEditing) {
      // Check if this specific slot can be edited
      if (!canEditSlot(slot)) return;

      // Only allow editing available and unavailable slots, not booked ones
      if (slot.booked) return;

      const newSelectedSlots = new Set(selectedSlotsForEdit);

      if (newSelectedSlots.has(index)) {
        // Deselect
        newSelectedSlots.delete(index);
      } else {
        // Select
        newSelectedSlots.add(index);
      }

      setSelectedSlotsForEdit(newSelectedSlots);
    }
    // Non-editing mode slot selection is handled in the component
  };

  const handleMarkAvailable = () => {
    const newSlots = [...slots];
    selectedSlotsForEdit.forEach(index => {
      newSlots[index] = {
        ...newSlots[index],
        available: true,
        booked: false,
        reason: undefined,
      };
    });
    setSlots(newSlots);
    setSelectedSlotsForEdit(new Set());
    onSlotsData?.(newSlots);
    onSlotsChange?.(newSlots);
  };

  const handleMarkUnavailable = () => {
    setPendingSlotIndices(Array.from(selectedSlotsForEdit));
    setCurrentReason('');
    setReasonModalOpen(true);
  };

  const handleConfirmUnavailable = () => {
    const newSlots = [...slots];
    pendingSlotIndices.forEach(index => {
      newSlots[index] = {
        ...newSlots[index],
        available: false,
        booked: false,
        reason: currentReason.trim() || 'Unavailable',
      };
    });
    setSlots(newSlots);
    setSelectedSlotsForEdit(new Set());
    setReasonModalOpen(false);
    setPendingSlotIndices([]);
    onSlotsData?.(newSlots);
    onSlotsChange?.(newSlots);
  };

  const handleCancelReason = () => {
    setReasonModalOpen(false);
    setPendingSlotIndices([]);
    setCurrentReason('');
  };

  const handleSaveChanges = () => {
    onSlotsUpdate?.(slots);
    setIsEditing(false);
    setSelectedSlotsForEdit(new Set());
  };

  const handleCancelEdit = () => {
    // Reset to the state before editing started - reload from availability data and meetings
    if (selectedDate) {
      const newSlots = generateTimeSlots();
      const mergedSlots = mergeSlotsWithData(newSlots, selectedDate, availabilityData, meetingsData);

      setSlots(mergedSlots);
      onSlotsData?.(mergedSlots);
      onSlotsChange?.(mergedSlots);
    }
    setIsEditing(false);
    setSelectedSlotsForEdit(new Set());
  };

  return {
    isEditing,
    setIsEditing,
    slots,
    selectedSlotsForEdit,
    reasonModalOpen,
    setReasonModalOpen,
    currentReason,
    setCurrentReason,
    pendingSlotIndices,
    canEditSlots,
    canEditSlot,
    handleSlotClick,
    handleMarkAvailable,
    handleMarkUnavailable,
    handleConfirmUnavailable,
    handleCancelReason,
    handleSaveChanges,
    handleCancelEdit,
  };
};