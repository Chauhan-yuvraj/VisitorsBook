import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSlotDisplay, isSlotInPast } from '@/utils/timeSlots';
import type { TimeSlot } from '@/utils/timeSlots';

interface TimeSlotCardProps {
  slot: TimeSlot;
  index: number;
  isEditing: boolean;
  selectedSlot?: string;
  selectedSlotsForEdit: Set<number>;
  canEditSlot: (slot: TimeSlot) => boolean;
  onSlotClick: (slot: TimeSlot, index: number) => void;
  selectedDate: Date;
  className?: string;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  slot,
  index,
  isEditing,
  selectedSlot,
  selectedSlotsForEdit,
  canEditSlot,
  onSlotClick,
  selectedDate,
  className,
}) => {
  const display = getSlotDisplay(slot);
  const IconComponent = display.icon === 'CheckCircle' ? CheckCircle : XCircle;
  const isSelectedForEdit = selectedSlotsForEdit.has(index);
  const isSelected = selectedSlot === slot.time && !isEditing;
  const canEdit = canEditSlot(slot);
  const isInPast = isSlotInPast(slot, selectedDate);

  const handleClick = () => {
    // Allow clicking on all slots for viewing details, regardless of status
    // Only restrict in editing mode for slots that can't be edited
    if (isEditing && (slot.booked || !canEdit)) return;
    onSlotClick(slot, index);
  };

  return (
    <button
      onClick={handleClick}
      disabled={
        isEditing && (slot.booked || !canEdit)
      }
      className={cn(
        // Base styles
        'group relative flex flex-col items-center justify-center rounded-lg border transition-all duration-200 text-center min-h-[60px] sm:min-h-[70px] p-3 sm:p-4',
        // Background and border
        display.bgColor,
        // Hover effects (improved - no scale to prevent layout shifts)
        'hover:shadow-md hover:-translate-y-0.5',
        // Selection states
        isSelected && 'ring-2 ring-primary/50 shadow-md bg-primary/5',
        isSelectedForEdit && 'ring-2 ring-primary bg-primary/10 border-primary',
        // Disabled states - only apply in editing mode
        isEditing && (slot.booked || !canEdit) && 'cursor-not-allowed opacity-60',
        // Interactive states - all slots are clickable for viewing details in non-editing mode
        'cursor-pointer',
        // Custom className
        className
      )}
    >
      {/* Time display */}
      <span className="text-sm sm:text-base font-semibold mb-1 leading-tight text-foreground">
        {slot.time}
      </span>

      {/* Status indicator */}
      <div className="flex items-center justify-center gap-1">
        <IconComponent
          className={cn('h-4 w-4 shrink-0', display.iconColor)}
        />
        <span
          className={cn(
            'text-xs sm:text-sm font-medium truncate max-w-full',
            display.textColor
          )}
        >
          {isInPast && !isEditing ? 'Past' : display.text}
        </span>
      </div>

      {/* Additional info for booked slots */}
      {slot.booked && slot.person && (
        <span className="text-xs text-muted-foreground mt-1 truncate max-w-full">
          {slot.person}
        </span>
      )}

      {/* Reason tooltip on hover */}
      {slot.reason && !isEditing && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {slot.reason}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && !isEditing && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
        </div>
      )}
    </button>
  );
};