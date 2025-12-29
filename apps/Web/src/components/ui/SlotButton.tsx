import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "./TimeSlots";

interface SlotDisplay {
  icon: "CheckCircle" | "XCircle";
  iconColor: string;
  text: string;
  textColor: string;
  bgColor: string;
}

interface SlotButtonProps {
  slot: TimeSlot;
  index: number;
  isEditing: boolean;
  selectedSlot?: string;
  selectedSlotsForEdit: Set<number>;
  canEditSlot: (slot: TimeSlot) => boolean;
  onSlotClick: (slot: TimeSlot, index: number) => void;
  getSlotDisplay: (slot: TimeSlot) => SlotDisplay;
}

export const SlotButton: React.FC<SlotButtonProps> = ({
  slot,
  index,
  isEditing,
  selectedSlot,
  selectedSlotsForEdit,
  canEditSlot,
  onSlotClick,
  getSlotDisplay,
}) => {
  const display = getSlotDisplay(slot);
  const IconComponent = display.icon === "CheckCircle" ? CheckCircle : XCircle;

  return (
    <button
      onClick={() => onSlotClick(slot, index)}
      disabled={isEditing ? (slot.booked || !canEditSlot(slot)) : false}
      className={cn(
        "flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border transition-all duration-200 text-center",
        isEditing
          ? slot.booked || !canEditSlot(slot)
            ? "cursor-not-allowed opacity-60"
            : selectedSlotsForEdit.has(index)
            ? "cursor-pointer ring-2 ring-primary bg-primary/10 border-primary"
            : "hover:scale-105 active:scale-95 cursor-pointer"
          : "hover:scale-105 active:scale-95 cursor-pointer",
        display.bgColor,
        selectedSlot === slot.time &&
          !isEditing &&
          "ring-2 ring-primary/20"
      )}
    >
      <span className="text-xs sm:text-sm font-medium mb-1">
        {slot.time}
      </span>
      <div className="flex items-center gap-1">
        <IconComponent
          className={cn("h-3 w-3", display.iconColor)}
        />
        <span
          className={cn(
            "text-xs hidden sm:inline",
            display.textColor
          )}
        >
          {display.text}
        </span>
      </div>
    </button>
  );
};