import React from 'react';
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from '@/types/user';
import type { MeetingWizardFormData } from '@/constants/meetingWizard';

interface StepHostParticipantsProps {
  formData: MeetingWizardFormData;
  employees: Employee[];
  onHostChange: (value: string) => void;
  onParticipantToggle: (participantId: string) => void;
}

export const StepHostParticipants: React.FC<StepHostParticipantsProps> = ({
  formData,
  employees,
  onHostChange,
  onParticipantToggle,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 1: Host & Participants</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Select who will host the meeting and who should participate.
        </p>
      </div>

      {/* Host Selection */}
      <div>
        <Label htmlFor="hostId">Host *</Label>
        <Select
          value={formData.hostId}
          onValueChange={onHostChange}
        >
          <SelectTrigger className={!formData.hostId ? "border-destructive" : ""}>
            <SelectValue placeholder="Select host" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee._id} value={employee._id || ""}>
                {employee.name} ({employee.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!formData.hostId && (
          <p className="text-xs text-destructive mt-1">Please select a host for the meeting.</p>
        )}
      </div>

      {/* Participants Selection */}
      <div>
        <Label>Participants *</Label>
        <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-3">
          {employees
            .filter(employee => employee._id !== formData.hostId)
            .map((employee) => (
              <label key={employee._id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.participants.includes(employee._id || "")}
                  onChange={() => onParticipantToggle(employee._id || "")}
                  className="rounded border-gray-300"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{employee.name}</div>
                  <div className="text-xs text-muted-foreground">{employee.email}</div>
                </div>
              </label>
            ))}
        </div>
        {formData.participants.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">Please select at least one participant.</p>
        )}
      </div>
    </div>
  );
};