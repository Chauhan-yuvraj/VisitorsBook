export const TIME_SLOT_CONFIG = {
  startHour: 9,
  startMinute: 30,
  endHour: 18,
  endMinute: 0,
  intervalMinutes: 30,
} as const;

export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  UNAVAILABLE: 'unavailable',
} as const;

export const SLOT_TYPES = {
  MEETING: 'meeting',
  MAINTENANCE: 'maintenance',
  PERSONAL: 'personal',
  OTHER: 'other',
} as const;

export type SlotStatus = typeof SLOT_STATUS[keyof typeof SLOT_STATUS];
export type SlotType = typeof SLOT_TYPES[keyof typeof SLOT_TYPES];

export const TIME_SLOTS_BREAKPOINTS = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  large: 5,
  xl: 6,
} as const;

export const SLOT_DISPLAY_CONFIG = {
  [SLOT_STATUS.AVAILABLE]: {
    icon: 'CheckCircle' as const,
    iconColor: 'text-green-500',
    text: 'Available',
    textColor: 'text-green-600',
    bgColor: 'bg-background hover:bg-accent hover:border-accent-foreground border-border',
    hoverBgColor: 'hover:bg-accent',
  },
  [SLOT_STATUS.BOOKED]: {
    icon: 'XCircle' as const,
    iconColor: 'text-red-500',
    text: 'Booked',
    textColor: 'text-red-600',
    bgColor: 'bg-destructive/10 border-destructive/20 text-destructive',
    hoverBgColor: 'hover:bg-destructive/5',
  },
  [SLOT_STATUS.UNAVAILABLE]: {
    icon: 'XCircle' as const,
    iconColor: 'text-muted-foreground',
    text: 'Unavailable',
    textColor: 'text-muted-foreground',
    bgColor: 'bg-muted border-muted-foreground/20 text-muted-foreground',
    hoverBgColor: 'hover:bg-muted/80',
  },
} as const;