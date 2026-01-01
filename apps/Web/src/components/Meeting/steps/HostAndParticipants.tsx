import React from "react";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/user";

interface HostAndParticipantsProps {
  hostId: string;
  participants: string[];
  employees: Employee[];
  onHostChange: (value: string) => void;
  onParticipantToggle: (participantId: string) => void;
}

export const HostAndParticipants: React.FC<HostAndParticipantsProps> = ({
  hostId,
  participants,
  employees,
  onHostChange,
  onParticipantToggle,
}) => {
  return (
    <div className="space-y-6">
      {/* Host Selection */}
      <div>
        <Label htmlFor="hostId">Host *</Label>
        <Select value={hostId} onValueChange={onHostChange}>
          <SelectTrigger className={!hostId ? "border-destructive" : ""}>
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
        {!hostId && (
          <p className="text-xs text-destructive mt-1">
            Please select a host for the meeting.
          </p>
        )}
      </div>

      {/* Participants Selection */}
      <div>
        <Label>Participants *</Label>
        <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-3">
          {employees
            .filter((employee) => employee._id !== hostId)
            .map((employee) => (
              <label
                key={employee._id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={participants.includes(employee._id || "")}
                  onChange={() => onParticipantToggle(employee._id || "")}
                  className="rounded border-gray-300"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{employee.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {employee.email}
                  </div>
                </div>
              </label>
            ))}
        </div>

        {participants.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Please select at least one participant.
          </p>
        )}
      </div>
    </div>
  );
};
