import React from 'react';
import { cn } from '@/lib/utils';

interface TimeSlotsEditModeIndicatorProps {
  isEditing: boolean;
  selectedSlotsCount: number;
  className?: string;
}

export const TimeSlotsEditModeIndicator: React.FC<TimeSlotsEditModeIndicatorProps> = ({
  isEditing,
  selectedSlotsCount,
  className,
}) => {
  if (!isEditing) return null;

  return (
    <div className={cn(
      'mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg',
      className
    )}>
      <p className="text-sm text-blue-800 dark:text-blue-200">
        <strong>Edit Mode:</strong> Select multiple slots to mark as Available or Unavailable. Booked slots and past time slots cannot be modified.
        {selectedSlotsCount > 0 && (
          <span className="block mt-1">
            <strong>{selectedSlotsCount} slot{selectedSlotsCount !== 1 ? 's' : ''} selected</strong>
          </span>
        )}
      </p>
    </div>
  );
};