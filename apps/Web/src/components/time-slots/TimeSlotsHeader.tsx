import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateForDisplay } from '@/utils/timeSlots';
import { EditControls } from '@/components/ui/EditControls';

interface TimeSlotsHeaderProps {
  selectedDate?: Date;
  editMode?: boolean;
  isEditing: boolean;
  canEditSlots: () => boolean;
  selectedSlotsForEdit: Set<number>;
  onEditToggle: () => void;
  onMarkAvailable: () => void;
  onMarkUnavailable: () => void;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
  className?: string;
}

export const TimeSlotsHeader: React.FC<TimeSlotsHeaderProps> = ({
  selectedDate,
  editMode = false,
  isEditing,
  canEditSlots,
  selectedSlotsForEdit,
  onEditToggle,
  onMarkAvailable,
  onMarkUnavailable,
  onCancelEdit,
  onSaveChanges,
  className,
}) => {
  const title = selectedDate
    ? `Time Slots - ${formatDateForDisplay(selectedDate)}`
    : 'Select a date to view time slots';

  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2',
      className
    )}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
        <h3 className="font-semibold text-base sm:text-lg leading-tight truncate">
          {title}
        </h3>
      </div>

      {selectedDate && editMode && (
        <div className="shrink-0">
          <EditControls
            isEditing={isEditing}
            canEditSlots={canEditSlots}
            selectedSlotsForEdit={selectedSlotsForEdit}
            onEditToggle={onEditToggle}
            onMarkAvailable={onMarkAvailable}
            onMarkUnavailable={onMarkUnavailable}
            onCancelEdit={onCancelEdit}
            onSaveChanges={onSaveChanges}
          />
        </div>
      )}
    </div>
  );
};