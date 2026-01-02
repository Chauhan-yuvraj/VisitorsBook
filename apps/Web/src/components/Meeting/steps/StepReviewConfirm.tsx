import React from 'react';
import type { MeetingWizardFormData } from '@/constants/meetingWizard';
import type { MeetingTimeSlot } from '@/types/meeting';
import type { Employee } from '@/types/user';
import type { IDepartment } from '@repo/types';

interface StepReviewConfirmProps {
  formData: MeetingWizardFormData;
  selectedDate: Date | undefined;
  selectedSlots: MeetingTimeSlot[];
  employees: Employee[];
  departments: IDepartment[];
  user: { _id?: string; name?: string } | null;
}

export const StepReviewConfirm: React.FC<StepReviewConfirmProps> = ({
  formData,
  selectedDate,
  selectedSlots,
  employees,
  departments,
  user,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 5: Review & Confirm</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Please review your meeting details before confirming.
        </p>
      </div>

      {/* Review Summary */}
      <div className="space-y-4 bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Meeting Title</h4>
            <p className="text-sm mt-1">{formData.title}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Organizer</h4>
            <p className="text-sm mt-1">{user?.name || "You"}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Host</h4>
            <p className="text-sm mt-1">
              {employees.find(e => e._id === formData.hostId)?.name || "Unknown"}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Type</h4>
            <p className="text-sm mt-1">{formData.isVirtual ? "Virtual" : "In-Person"}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Departments</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {formData.departments.map(departmentId => {
              const department = departments.find(d => d._id === departmentId);
              return (
                <span key={departmentId} className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs">
                  {department?.departmentName || departmentId}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Participants</h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {formData.participants.map(participantId => {
              const participant = employees.find(e => e._id === participantId);
              return (
                <span key={participantId} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {participant?.name || "Unknown"}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            {formData.isVirtual ? "Meeting Link" : "Location"}
          </h4>
          <p className="text-sm mt-1 break-all">{formData.location}</p>
        </div>

        {formData.agenda && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Agenda</h4>
            <p className="text-sm mt-1">{formData.agenda}</p>
          </div>
        )}

        {formData.remarks && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Remarks</h4>
            <p className="text-sm mt-1">{formData.remarks}</p>
          </div>
        )}

        <div>
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Date & Time</h4>
          <div className="mt-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString()}
            </p>
            <div>
              <p className="text-sm font-medium mb-1">Time Slots:</p>
              <div className="flex flex-wrap gap-1">
                {selectedSlots.map((slot, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};