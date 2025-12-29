export const TIME_SLOT_CONFIG = {
  startHour: 9,
  startMinute: 30,
  endHour: 18,
  endMinute: 0,
  intervalMinutes: 30,
};

export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  UNAVAILABLE: 'unavailable',
} as const;

export type SlotStatus = typeof SLOT_STATUS[keyof typeof SLOT_STATUS];