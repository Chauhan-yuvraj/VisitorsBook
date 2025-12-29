import React from "react";
import { Button } from "./Button";
import Modal from "./Modal";
import { Input } from "./Input";

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReason: string;
  setCurrentReason: (reason: string) => void;
  pendingSlotIndices: number[];
  onConfirm: () => void;
}

export const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  currentReason,
  setCurrentReason,
  pendingSlotIndices,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reason for Unavailability"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please provide a reason for marking {pendingSlotIndices.length} slot{pendingSlotIndices.length !== 1 ? 's' : ''} as unavailable:
        </p>
        <Input
          value={currentReason}
          onChange={(e) => setCurrentReason(e.target.value)}
          placeholder="Enter reason (optional)"
          className="w-full"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};