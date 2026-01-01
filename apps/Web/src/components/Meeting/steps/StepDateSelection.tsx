import React from "react";
import { Label } from "@/components/ui/Label";
import { Calendar } from "@/components/ui/calendar";

interface StepDateSelectionProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const StepDateSelection: React.FC<StepDateSelectionProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Step 5: Date Selection</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a date for your meeting.
        </p>
      </div>

      {/* Content */}
      <div className="flex justify-center">
        <div className="space-y-4">
          <Label className="text-center block">Select Date</Label>
          <div className="border rounded-lg p-4 bg-card">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              className="rounded-md border-0"
            />
          </div>

          {selectedDate && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};