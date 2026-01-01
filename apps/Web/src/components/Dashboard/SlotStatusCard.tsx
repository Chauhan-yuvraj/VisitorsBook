import React from "react";
import type { TimeSlot } from "@/components/ui/TimeSlots";

interface SlotStatusCardProps {
  selectedSlot?: TimeSlot;
}

const SlotStatusCard: React.FC<SlotStatusCardProps> = ({ selectedSlot }) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 w-full min-h-50">
      <h3 className="font-semibold text-base sm:text-lg mb-4">Slot Status</h3>

      {!selectedSlot ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm mb-2">
            Select a time slot to view details
          </p>
          <p className="text-xs text-muted-foreground">
            Click on any time slot to see its current status and details
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Time Header */}
          <div className="text-center pb-3 border-b">
            <div className="text-lg font-semibold text-foreground">
              {selectedSlot.time}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Click any slot to view its details
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-3 py-2">
            {selectedSlot.available ? (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-semibold text-lg">Available</span>
              </>
            ) : selectedSlot.booked ? (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-semibold text-lg">Booked</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600 font-semibold text-lg">Unavailable</span>
              </>
            )}
          </div>

          {/* Detailed Information */}
          <div className="space-y-3 text-sm">
            {selectedSlot.booked && (
              <>
                {selectedSlot.reason && (
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="font-medium text-red-800 dark:text-red-200">
                      Meeting:
                    </span>
                    <p className="text-red-700 dark:text-red-300 mt-1 font-medium">
                      {selectedSlot.reason}
                    </p>
                  </div>
                )}
                {selectedSlot.person && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Host/Organizer:
                    </span>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                      {selectedSlot.person}
                    </p>
                  </div>
                )}
                {selectedSlot.type === "meeting" && selectedSlot.meetingLink && (
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      Meeting Link:
                    </span>
                    <a
                      href={selectedSlot.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:underline break-all block mt-1 text-xs"
                    >
                      {selectedSlot.meetingLink}
                    </a>
                  </div>
                )}
              </>
            )}

            {!selectedSlot.available && !selectedSlot.booked && selectedSlot.reason && (
              <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Reason:
                </span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {selectedSlot.reason}
                </p>
              </div>
            )}

            {selectedSlot.available && (
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                <span className="text-green-800 dark:text-green-200 font-medium">
                  This time slot is available for scheduling
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotStatusCard;