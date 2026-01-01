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
import type { IDepartment } from "@repo/types";
import type { MeetingWizardFormData } from "@/constants/meetingWizard";

interface StepHostParticipantsProps {
  formData: MeetingWizardFormData;
  employees: Employee[];
  departments: IDepartment[];
  onHostChange: (value: string) => void;
  onParticipantToggle: (participantId: string) => void;
  onDepartmentToggle: (departmentId: string) => void;
  onMeetingScopeChange: (
    scope: "general" | "departments" | "separate"
  ) => void;
}

export const StepHostParticipants: React.FC<StepHostParticipantsProps> = ({
  formData,
  departments,
  onDepartmentToggle,
  onMeetingScopeChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 1: Meeting Setup</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Select meeting scope, departments (if applicable), host and participants.
        </p>
      </div>

      {/* Meeting Scope */}
      <div>
        <Label htmlFor="scope">Meeting Scope *</Label>
        <Select
          value={formData.scope}
          onValueChange={(value) =>
            onMeetingScopeChange(value as "general" | "departments" | "separate")
          }
        >
          <SelectTrigger className={!formData.scope ? "border-destructive" : ""}>
            <SelectValue placeholder="Select meeting scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">
              General Meeting (Visible to all employees)
            </SelectItem>
            <SelectItem value="departments">
              Department Meeting (Visible to selected departments)
            </SelectItem>
            <SelectItem value="separate">
              Separate Meeting (Visible to admins/HR only)
            </SelectItem>
          </SelectContent>
        </Select>
        {!formData.scope && (
          <p className="text-xs text-destructive mt-1">
            Please select meeting scope.
          </p>
        )}
      </div>

      {/* Department Selection */}
      {formData.scope === "departments" && (
        <div>
          <Label>Departments *</Label>
          <div className="max-h-32 overflow-y-auto border rounded-md p-3 space-y-3">
            {departments.map((department) => (
              <label
                key={department._id}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.departments.includes(
                    department._id || ""
                  )}
                  onChange={() =>
                    onDepartmentToggle(department._id || "")
                  }
                  className="rounded border-gray-300"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {department.departmentName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {department.departmentCode}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {formData.departments.length === 0 && (
            <p className="text-xs text-destructive mt-1">
              Please select at least one department.
            </p>
          )}
        </div>
      )}


    </div>
  );
};
