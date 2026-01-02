import React from 'react';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
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

      <div className="space-y-6">
        {/* Meeting Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Meeting Type</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSelectChange("isVirtual", false)}
              className={`p-4 border rounded-lg text-left transition-all ${
                !formData.isVirtual
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  !formData.isVirtual ? "border-primary bg-primary" : "border-gray-300"
                }`}>
                  {!formData.isVirtual && (
                    <div className="w-full h-full rounded-full bg-primary scale-50"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">In-Person Meeting</div>
                  <div className="text-xs text-muted-foreground">Physical location</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectChange("isVirtual", true)}
              className={`p-4 border rounded-lg text-left transition-all ${
                formData.isVirtual
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.isVirtual ? "border-primary bg-primary" : "border-gray-300"
                }`}>
                  {formData.isVirtual && (
                    <div className="w-full h-full rounded-full bg-primary scale-50"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">Virtual Meeting</div>
                  <div className="text-xs text-muted-foreground">Online meeting</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Location/Link */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            {formData.isVirtual ? "Meeting Link" : "Location"} *
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={onInputChange}
            placeholder={
              formData.isVirtual
                ? "Enter meeting link (e.g., Zoom, Teams)"
                : "Enter location or room name"
            }
            className={`w-full ${!formData.location.trim() ? "border-destructive" : ""}`}
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
    </div>
  );
};