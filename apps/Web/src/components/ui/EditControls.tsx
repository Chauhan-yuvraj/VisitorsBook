import React from "react";
import { Edit3, Save, X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./Button";

interface EditControlsProps {
  isEditing: boolean;
  canEditSlots: () => boolean;
  selectedSlotsForEdit: Set<number>;
  onEditToggle: () => void;
  onMarkAvailable: () => void;
  onMarkUnavailable: () => void;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
}

export const EditControls: React.FC<EditControlsProps> = ({
  isEditing,
  canEditSlots,
  selectedSlotsForEdit,
  onEditToggle,
  onMarkAvailable,
  onMarkUnavailable,
  onCancelEdit,
  onSaveChanges,
}) => {
  if (!canEditSlots()) return null;

  return (
    <div className="flex gap-2">
      {!isEditing ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onEditToggle}
          className="flex items-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Edit Slots
        </Button>
      ) : (
        <div className="flex gap-2">
          {selectedSlotsForEdit.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAvailable}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Available ({selectedSlotsForEdit.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkUnavailable}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Mark Unavailable ({selectedSlotsForEdit.size})
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSaveChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      )}
    </div>
  );
};