import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { SlotButton } from "./SlotButton";
import { EditControls } from "./EditControls";
import { ReasonModal } from "./ReasonModal";

export interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
  reason?: string;
  person?: string;
  meetingLink?: string;
  type?: "meeting" | "maintenance" | "personal" | "other";
}

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
    getSlotDisplay,
  } = useTimeSlots({
    selectedDate,
    onSlotsUpdate,
    onSlotsData,
    onSlotsChange,
    availabilityData,
    meetingsData,
  });

  const handleSlotClickWrapper = (slot: TimeSlot, index: number) => {
    if (isEditing) {
      handleSlotClick(slot, index);
    } else {
      onSlotSelect?.(slot);
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
          <h3 className="font-semibold text-base sm:text-lg leading-tight">
            {selectedDate
              ? `Time Slots - ${selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}`
              : "Select a date to view time slots"}
          </h3>
        </div>

        {selectedDate && editMode && (
          <EditControls
            isEditing={isEditing}
            canEditSlots={canEditSlots}
            selectedSlotsForEdit={selectedSlotsForEdit}
            onEditToggle={() => setIsEditing(!isEditing)}
            onMarkAvailable={handleMarkAvailable}
            onMarkUnavailable={handleMarkUnavailable}
            onCancelEdit={handleCancelEdit}
            onSaveChanges={handleSaveChanges}
          />
        )}
      </div>

      {!selectedDate ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            Please select a date from the calendar to view available time slots.
          </p>
        </div>
      ) : (
        <>
          {isEditing && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Edit Mode:</strong> Select multiple slots to mark as Available or Unavailable. Booked slots and past time slots cannot be modified.
                {selectedSlotsForEdit.size > 0 && (
                  <span className="block mt-1">
                    <strong>{selectedSlotsForEdit.size} slot{selectedSlotsForEdit.size !== 1 ? 's' : ''} selected</strong>
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 max-h-96 overflow-y-auto">
            {slots.map((slot, index) => (
              <SlotButton
                key={slot.time}
                slot={slot}
                index={index}
                isEditing={isEditing}
                selectedSlot={selectedSlot}
                selectedSlotsForEdit={selectedSlotsForEdit}
                canEditSlot={canEditSlot}
                onSlotClick={handleSlotClickWrapper}
                getSlotDisplay={getSlotDisplay}
              />
            ))}
          </div>
        </>
      )}

      {selectedDate && !isEditing && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      )}

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
