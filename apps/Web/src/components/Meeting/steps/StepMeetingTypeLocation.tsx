import React from 'react';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MeetingWizardFormData } from '@/constants/meetingWizard';

interface StepMeetingTypeLocationProps {
  formData: MeetingWizardFormData;
  onSelectChange: (name: string, value: string | boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const StepMeetingTypeLocation: React.FC<StepMeetingTypeLocationProps> = ({
  formData,
  onSelectChange,
  onInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 3: Meeting Type & Location</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Choose how the meeting will be conducted and where.
        </p>
      </div>

      {/* Meeting Type */}
      <div>
        <Label htmlFor="isVirtual">Meeting Type</Label>
        <Select
          value={formData.isVirtual ? "virtual" : "in-person"}
          onValueChange={(value) => onSelectChange("isVirtual", value === "virtual")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-person">In-Person Meeting</SelectItem>
            <SelectItem value="virtual">Virtual Meeting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location/Link */}
      <div>
        <Label htmlFor="location">
          {formData.isVirtual ? "Meeting Link" : "Location"} *
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={onInputChange}
          placeholder={formData.isVirtual ? "Enter meeting link (e.g., Zoom, Teams)" : "Enter location or room name"}
          className={!formData.location.trim() ? "border-destructive" : ""}
        />
        {!formData.location.trim() && (
          <p className="text-xs text-destructive mt-1">
            Please enter the {formData.isVirtual ? "meeting link" : "location"}.
          </p>
        )}
        {formData.isVirtual && (
          <p className="text-xs text-muted-foreground mt-1">
            Make sure to include the full meeting link with access details.
          </p>
        )}
      </div>
    </div>
  );
};