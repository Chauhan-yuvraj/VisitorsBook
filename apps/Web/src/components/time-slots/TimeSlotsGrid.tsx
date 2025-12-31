import React from 'react';
import { cn } from '@/lib/utils';
import { TIME_SLOTS_BREAKPOINTS } from '@/constants/timeSlots';
import { TimeSlotCard } from './TimeSlotCard';
import type { TimeSlot } from '@/utils/timeSlots';

interface TimeSlotsGridProps {
  slots: TimeSlot[];
  isEditing: boolean;
  selectedSlot?: string;
  selectedSlotsForEdit: Set<number>;
  canEditSlot: (slot: TimeSlot) => boolean;
  onSlotClick: (slot: TimeSlot, index: number) => void;
  selectedDate: Date;
  className?: string;
}

export const TimeSlotsGrid: React.FC<TimeSlotsGridProps> = ({
  slots,
  isEditing,
  selectedSlot,
  selectedSlotsForEdit,
  canEditSlot,
  onSlotClick,
  selectedDate,
  className,
}) => {
  return (
    <div
      className={cn(
        // Responsive grid layout
        'grid gap-2 sm:gap-3',
        `grid-cols-${TIME_SLOTS_BREAKPOINTS.mobile}`, // 2 columns on mobile
        `sm:grid-cols-${TIME_SLOTS_BREAKPOINTS.tablet}`, // 3 columns on small screens
        `md:grid-cols-${TIME_SLOTS_BREAKPOINTS.desktop}`, // 4 columns on medium screens
        `lg:grid-cols-${TIME_SLOTS_BREAKPOINTS.large}`, // 5 columns on large screens
        `xl:grid-cols-${TIME_SLOTS_BREAKPOINTS.xl}`, // 6 columns on extra large screens
        // Scrollable container
        'max-h-96 overflow-y-auto',
        // Custom scrollbar styling
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        // Custom className
        className
      )}
    >
      {slots.map((slot, index) => (
        <TimeSlotCard
          key={`${slot.time}-${index}`}
          slot={slot}
          index={index}
          isEditing={isEditing}
          selectedSlot={selectedSlot}
          selectedSlotsForEdit={selectedSlotsForEdit}
          canEditSlot={canEditSlot}
          onSlotClick={onSlotClick}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  );
};