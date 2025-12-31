import { TIME_SLOT_CONFIG, SLOT_STATUS, SLOT_TYPES, SLOT_DISPLAY_CONFIG } from '@/constants/timeSlots';
import type { SlotType } from '@/constants/timeSlots';

export interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
  reason?: string;
  person?: string;
  meetingLink?: string;
  type?: SlotType;
}

export interface SlotDisplay {
  icon: 'CheckCircle' | 'XCircle';
  iconColor: string;
  text: string;
  textColor: string;
  bgColor: string;
  hoverBgColor: string;
}

/**
 * Generate time slots from start to end time with given interval
 */
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startTime = new Date();
  startTime.setHours(TIME_SLOT_CONFIG.startHour, TIME_SLOT_CONFIG.startMinute, 0, 0);

  const endTime = new Date();
  endTime.setHours(TIME_SLOT_CONFIG.endHour, TIME_SLOT_CONFIG.endMinute, 0, 0);

  const currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    const timeString = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    slots.push({
      time: timeString,
      available: true,
    });

    // Add interval minutes
    currentTime.setMinutes(currentTime.getMinutes() + TIME_SLOT_CONFIG.intervalMinutes);
  }

  return slots;
};

/**
 * Get the display configuration for a slot based on its status
 */
export const getSlotDisplay = (slot: TimeSlot): SlotDisplay => {
  if (slot.available) {
    return SLOT_DISPLAY_CONFIG[SLOT_STATUS.AVAILABLE];
  } else if (slot.booked) {
    return SLOT_DISPLAY_CONFIG[SLOT_STATUS.BOOKED];
  } else {
    return SLOT_DISPLAY_CONFIG[SLOT_STATUS.UNAVAILABLE];
  }
};

/**
 * Check if a date can be edited (not in the past)
 */
export const canEditDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDateOnly = new Date(date);
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

/**
 * Check if a specific slot can be edited based on its time
 */
export const canEditSlot = (slot: TimeSlot, selectedDate: Date): boolean => {
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

/**
 * Check if a time slot is in the past (cannot be selected for meetings)
 */
export const isSlotInPast = (slot: TimeSlot, selectedDate: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDateOnly = new Date(selectedDate);
  selectedDateOnly.setHours(0, 0, 0, 0);

  // If date is in the past, all slots are in the past
  if (selectedDateOnly < today) return true;

  // If date is today, check if slot time is in the past
  if (selectedDateOnly.getTime() === today.getTime()) {
    const now = new Date();
    // Parse time like "10:00 AM" or "02:30 PM"
    const timeMatch = slot.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return true;

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    // Slot is in the past if it's before current time
    return slotTime <= now;
  }

  // Future dates - slots are not in the past
  return false;
};

/**
 * Merge slots with availability and meetings data
 */
export const mergeSlotsWithData = (
  slots: TimeSlot[],
  selectedDate: Date,
  availabilityData?: any[],
  meetingsData?: any[]
): TimeSlot[] => {
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  // Create availability map
  const availabilityMap = new Map();
  if (availabilityData && availabilityData.length > 0) {
    availabilityData.forEach((avail: any) => {
      const startTime = new Date(avail.startTime);
      const timeString = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      availabilityMap.set(timeString, avail);
    });
  }

  // Create meetings map for the selected date
  const meetingsMap = new Map();
  if (meetingsData && meetingsData.length > 0) {
    meetingsData.forEach((meeting: any) => {
      if (meeting.status === 'scheduled' && meeting.timeSlots) {
        meeting.timeSlots.forEach((slot: any) => {
          if (slot.date === selectedDateStr) {
            const startTime = new Date(slot.startTime);
            const timeString = startTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            meetingsMap.set(timeString, {
              ...meeting,
              slotStartTime: slot.startTime,
              slotEndTime: slot.endTime,
            });
          }
        });
      }
    });
  }

  // Merge slots with availability and meetings (meetings take priority)
  return slots.map((slot) => {
    const meeting = meetingsMap.get(slot.time);
    const availability = availabilityMap.get(slot.time);

    // Meeting takes priority - mark as booked
    if (meeting) {
      const hostName = typeof meeting.host === 'object' && meeting.host?.name
        ? meeting.host.name
        : 'Meeting';
      return {
        ...slot,
        available: false,
        booked: true,
        reason: meeting.title,
        person: hostName,
        type: SLOT_TYPES.MEETING,
        meetingLink: meeting.isVirtual ? meeting.location : undefined,
      };
    } else if (availability) {
      return {
        ...slot,
        available: availability.status === 'UNAVAILABLE' ? false : true,
        reason: availability.reason || undefined,
      };
    }
    return slot;
  });
};

/**
 * Format date for display in time slots header
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};