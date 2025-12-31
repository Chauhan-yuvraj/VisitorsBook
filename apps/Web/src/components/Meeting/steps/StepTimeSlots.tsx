import React from "react";
import { Label } from "@/components/ui/Label";
import { TimeSlots } from "@/components/ui/TimeSlots";
import type { MeetingTimeSlot } from "@/types/meeting";

interface StepTimeSlotsProps {
  selectedDate: Date | undefined;
  selectedSlots: MeetingTimeSlot[];
  onSlotSelect: (slot: { time: string; available: boolean; booked?: boolean }) => void;
}

export const StepTimeSlots: React.FC<StepTimeSlotsProps> = ({
  selectedDate,
  selectedSlots,
  onSlotSelect,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Step 5: Time Slots</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose one or more available time slots for your meeting.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Time Slots Selection */}
        <div className="space-y-2">
          <Label>Select Time Slots</Label>
          <div className="border rounded-md p-4 max-h-125 overflow-hidden">
            <TimeSlots
              selectedDate={selectedDate}
              onSlotSelect={onSlotSelect}
              selectedSlot={undefined}
              editMode={false}
              availabilityData={[]}
            />
          </div>

          {/* Selected Slots */}
          {selectedSlots.length > 0 ? (
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">
                Selected time slots ({selectedSlots.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs md:text-sm"
                  >
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(slot.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-muted-foreground pt-2">
              Select at least one time slot to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
