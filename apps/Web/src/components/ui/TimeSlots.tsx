import React from 'react';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { TimeSlotsHeader } from '@/components/time-slots/TimeSlotsHeader';
import { TimeSlotsGrid } from '@/components/time-slots/TimeSlotsGrid';
import { TimeSlotsLegend } from '@/components/time-slots/TimeSlotsLegend';
import { TimeSlotsEmptyState } from '@/components/time-slots/TimeSlotsEmptyState';
import { TimeSlotsEditModeIndicator } from '@/components/time-slots/TimeSlotsEditModeIndicator';
import { ReasonModal } from '@/components/ui/ReasonModal';
import { cn } from '@/lib/utils';
import type { TimeSlot } from '@/utils/timeSlots';

// Re-export TimeSlot type for backward compatibility
export type { TimeSlot };

interface TimeSlotsProps {
  selectedDate?: Date;
  onSlotSelect?: (slot: TimeSlot) => void;
  selectedSlot?: string;
  editMode?: boolean;
  onSlotsUpdate?: (slots: TimeSlot[]) => void;
  onSlotsData?: (slots: TimeSlot[]) => void;
  onSlotsChange?: (slots: TimeSlot[]) => void;
  availabilityData?: any[];
  meetingsData?: any[];
  className?: string;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
  onSlotSelect,
  selectedSlot,
  editMode = false,
  onSlotsUpdate,
  onSlotsData,
  onSlotsChange,
  availabilityData,
  meetingsData,
  className,
}) => {
  const {
    isEditing,
    setIsEditing,
    slots,
    selectedSlotsForEdit,
    reasonModalOpen,
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
  } = useTimeSlots({
    selectedDate,
    onSlotsUpdate,
    onSlotsData,
    onSlotsChange,
    availabilityData,
    meetingsData,
  });

  const handleSlotClickWrapper = (slot: TimeSlot, index: number) => {
    // Always allow selecting slots for viewing details
    onSlotSelect?.(slot);

    // Handle editing logic only when in edit mode
    if (isEditing) {
      handleSlotClick(slot, index);
    }
  };

  return (
    <div className={cn(
      'bg-card rounded-xl border shadow-sm p-4 sm:p-6 space-y-4',
      className
    )}>
      {/* Header with title and edit controls */}
      <TimeSlotsHeader
        selectedDate={selectedDate}
        editMode={editMode}
        isEditing={isEditing}
        canEditSlots={canEditSlots}
        selectedSlotsForEdit={selectedSlotsForEdit}
        onEditToggle={() => setIsEditing(!isEditing)}
        onMarkAvailable={handleMarkAvailable}
        onMarkUnavailable={handleMarkUnavailable}
        onCancelEdit={handleCancelEdit}
        onSaveChanges={handleSaveChanges}
      />

      {/* Empty state when no date is selected */}
      {!selectedDate ? (
        <TimeSlotsEmptyState />
      ) : (
        <>
          {/* Edit mode indicator */}
          <TimeSlotsEditModeIndicator
            isEditing={isEditing}
            selectedSlotsCount={selectedSlotsForEdit.size}
          />

          {/* Time slots grid */}
          <TimeSlotsGrid
            slots={slots}
            isEditing={isEditing}
            selectedSlot={selectedSlot}
            selectedSlotsForEdit={selectedSlotsForEdit}
            canEditSlot={canEditSlot}
            onSlotClick={handleSlotClickWrapper}
            selectedDate={selectedDate!}
          />

          {/* Legend for non-edit mode */}
          <TimeSlotsLegend isEditing={isEditing} />
        </>
      )}

      {/* Reason modal for marking slots unavailable */}
      <ReasonModal
        isOpen={reasonModalOpen}
        onClose={handleCancelReason}
        currentReason={currentReason}
        setCurrentReason={setCurrentReason}
        pendingSlotIndices={pendingSlotIndices}
        onConfirm={handleConfirmUnavailable}
      />
    </div>
  );
};
