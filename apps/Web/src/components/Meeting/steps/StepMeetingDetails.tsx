import React from 'react';
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { MeetingWizardFormData } from '@/constants/meetingWizard';

interface StepMeetingDetailsProps {
  formData: MeetingWizardFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const StepMeetingDetails: React.FC<StepMeetingDetailsProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 2: Meeting Details</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Provide basic information about your meeting.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Meeting Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Enter meeting title"
            className={`w-full ${!formData.title.trim() ? "border-destructive" : ""}`}
          />
          {!formData.title.trim() && (
            <p className="text-xs text-destructive mt-1">Please enter a meeting title.</p>
          )}
        </div>

        {/* Agenda */}
        <div className="space-y-2">
          <Label htmlFor="agenda" className="text-sm font-medium">Agenda</Label>
          <Textarea
            id="agenda"
            name="agenda"
            value={formData.agenda}
            onChange={onInputChange}
            placeholder="Meeting agenda or topics to discuss"
            rows={4}
            className="w-full resize-none"
          />
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm font-medium">Remarks (Optional)</Label>
          <Textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={onInputChange}
            placeholder="Any additional notes or instructions"
            rows={3}
            className="w-full resize-none"
          />
        </div>
      </div>
    </div>
  );
};