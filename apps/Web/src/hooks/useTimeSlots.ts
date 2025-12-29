import { useState, useEffect } from "react";
import { TIME_SLOT_CONFIG } from "@/constants/timeSlots";
import type { TimeSlot } from "@/components/ui/TimeSlots";

interface UseTimeSlotsProps {
  selectedDate?: Date;
  onSlotsUpdate?: (slots: TimeSlot[]) => void;
  onSlotsData?: (slots: TimeSlot[]) => void;
  availabilityData?: any[];
}

export const useTimeSlots = ({
  selectedDate,
  onSlotsUpdate,
  onSlotsData,
  availabilityData,
}: UseTimeSlotsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotsForEdit, setSelectedSlotsForEdit] = useState<Set<number>>(new Set());
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState("");
  const [pendingSlotIndices, setPendingSlotIndices] = useState<number[]>([]);

  // Check if slots can be edited (not past dates)
  const canEditSlots = (): boolean => {
    if (!selectedDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // If date is in the past, cannot edit
    if (selectedDateOnly < today) return false;

    // If date is today, check if current time allows editing
    if (selectedDateOnly.getTime() === today.getTime()) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Only allow editing if current time is before 6:00 PM
      return currentHour < 18 || (currentHour === 18 && currentMinute === 0);
    }

    // Future dates can be edited
    return true;
  };

  // Check if a specific slot can be edited
  const canEditSlot = (slot: TimeSlot): boolean => {
    if (!selectedDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // If date is in the past, cannot edit
    if (selectedDateOnly < today) return false;

    // If date is today, check if slot time is in the future
    if (selectedDateOnly.getTime() === today.getTime()) {
      const now = new Date();
      // Parse time like "10:00 AM" or "02:30 PM"
      const timeMatch = slot.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!timeMatch) return false;

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      // Only allow editing if slot time is after current time
      return slotTime > now;
    }

    // Future dates can be edited
    return true;
  };

  // Generate time slots from 9:30 AM to 6:00 PM in 30-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date();
    startTime.setHours(TIME_SLOT_CONFIG.startHour, TIME_SLOT_CONFIG.startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(TIME_SLOT_CONFIG.endHour, TIME_SLOT_CONFIG.endMinute, 0, 0);

    const currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      const timeString = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Mock some booked/unavailable slots
      let slot: TimeSlot = {
        time: timeString,
        available: true,
      };
      slots.push(slot);

      // Add 30 minutes
      currentTime.setMinutes(currentTime.getMinutes() + TIME_SLOT_CONFIG.intervalMinutes);
    }

    return slots;
  };

  // Initialize slots when component mounts or date changes
  useEffect(() => {
    if (selectedDate) {
      const newSlots = generateTimeSlots();

      // Merge availability data
      if (availabilityData && availabilityData.length > 0) {
        const availabilityMap = new Map();
        availabilityData.forEach((avail: any) => {
          const startTime = new Date(avail.startTime);
          const timeString = startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          availabilityMap.set(timeString, avail);
        });

        const mergedSlots = newSlots.map((slot) => {
          const availability = availabilityMap.get(slot.time);
          if (availability) {
            return {
              ...slot,
              available: availability.status === "UNAVAILABLE" ? false : true,
              reason: availability.reason || undefined,
            };
          }
          return slot;
        });

        setSlots(mergedSlots);
        onSlotsData?.(mergedSlots);
      } else {
        setSlots(newSlots);
        onSlotsData?.(newSlots);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, availabilityData]);

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
    } else {
      // Allow selecting any slot to view details
      // onSlotSelect is handled in the component
    }
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
  };

  const handleMarkUnavailable = () => {
    setPendingSlotIndices(Array.from(selectedSlotsForEdit));
    setCurrentReason("");
    setReasonModalOpen(true);
  };

  const handleConfirmUnavailable = () => {
    const newSlots = [...slots];
    pendingSlotIndices.forEach(index => {
      newSlots[index] = {
        ...newSlots[index],
        available: false,
        booked: false,
        reason: currentReason.trim() || "Unavailable",
      };
    });
    setSlots(newSlots);
    setSelectedSlotsForEdit(new Set());
    setReasonModalOpen(false);
    setPendingSlotIndices([]);
    onSlotsData?.(newSlots);
  };

  const handleCancelReason = () => {
    setReasonModalOpen(false);
    setPendingSlotIndices([]);
    setCurrentReason("");
  };

  const handleSaveChanges = () => {
    onSlotsUpdate?.(slots);
    setIsEditing(false);
    setSelectedSlotsForEdit(new Set());
  };

  const handleCancelEdit = () => {
    const resetSlots = generateTimeSlots(); // Reset to all available
    setSlots(resetSlots);
    onSlotsData?.(resetSlots);
    setIsEditing(false);
    setSelectedSlotsForEdit(new Set());
  };

  const getSlotDisplay = (slot: TimeSlot) => {
    if (slot.available) {
      return {
        icon: "CheckCircle" as const,
        iconColor: "text-green-500",
        text: "Available",
        textColor: "text-green-600",
        bgColor: "bg-background hover:bg-accent hover:border-accent-foreground border-border",
      };
    } else if (slot.booked) {
      return {
        icon: "XCircle" as const,
        iconColor: "text-red-500",
        text: "Booked",
        textColor: "text-red-600",
        bgColor: "bg-destructive/10 border-destructive/20 text-destructive",
      };
    } else {
      return {
        icon: "XCircle" as const,
        iconColor: "text-muted-foreground",
        text: "Unavailable",
        textColor: "text-muted-foreground",
        bgColor: "bg-muted border-muted-foreground/20 text-muted-foreground",
      };
    }
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
    getSlotDisplay,
  };
};