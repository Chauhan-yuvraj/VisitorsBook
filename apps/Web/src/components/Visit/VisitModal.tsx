import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { scheduleVisit, updateVisit } from "@/store/slices/visitSlice";
import { fetchVisitors } from "@/store/slices/visitorSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Visit, VisitStatus } from "@/types/visit";

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitToEdit?: Visit | null;
}

export default function VisitModal({
  isOpen,
  onClose,
  visitToEdit,
}: VisitModalProps) {
  const dispatch = useAppDispatch();
  const { visitors } = useAppSelector((state) => state.visitors);
  const { employees } = useAppSelector((state) => state.employees);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    visitorId: "",
    hostId: "",
    scheduledCheckIn: "",
    purpose: "",
    isWalkIn: false,
    status: "PENDING" as VisitStatus,
  });

  useEffect(() => {
    if (isOpen) {
      if (visitors.length === 0) dispatch(fetchVisitors());
      if (employees.length === 0) dispatch(fetchEmployees());
    }
  }, [isOpen, dispatch, visitors.length, employees.length]);

  useEffect(() => {
    if (visitToEdit) {
      // Format date for datetime-local input
      const date = new Date(visitToEdit.scheduledCheckIn);
      const formattedDate = date.toISOString().slice(0, 16);

      setFormData({
        visitorId: visitToEdit.visitor.id,
        hostId: visitToEdit.host.id,
        scheduledCheckIn: formattedDate,
        purpose: visitToEdit.purpose || "",
        isWalkIn: visitToEdit.isWalkIn,
        status: visitToEdit.status,
      });
    } else {
      setFormData({
        visitorId: "",
        hostId: "",
        scheduledCheckIn: new Date().toISOString().slice(0, 16),
        purpose: "",
        isWalkIn: false,
        status: "PENDING",
      });
    }
  }, [visitToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (visitToEdit) {
        await dispatch(
          updateVisit({
            id: visitToEdit._id,
            data: {
              scheduledCheckIn: new Date(formData.scheduledCheckIn).toISOString(),
              purpose: formData.purpose,
              isWalkIn: formData.isWalkIn,
              status: formData.status,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          scheduleVisit({
            visitorId: formData.visitorId,
            hostId: formData.hostId,
            scheduledCheckIn: new Date(formData.scheduledCheckIn).toISOString(),
            purpose: formData.purpose,
            isWalkIn: formData.isWalkIn,
          })
        ).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save visit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={visitToEdit ? "Edit Visit" : "Schedule Visit"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!visitToEdit && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visitor</label>
              <Select
                value={formData.visitorId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, visitorId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Visitor" />
                </SelectTrigger>
                <SelectContent>
                  {visitors.map((visitor) => (
                    <SelectItem key={visitor._id} value={visitor._id}>
                      {visitor.name} ({visitor.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Host (Employee)</label>
              <Select
                value={formData.hostId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hostId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Host" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id || ""}>
                      {employee.name} - {employee.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Scheduled Time</label>
          <input
            type="datetime-local"
            name="scheduledCheckIn"
            value={formData.scheduledCheckIn}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Purpose</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-20"
            placeholder="Meeting purpose..."
          />
        </div>

        {visitToEdit && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value as VisitStatus }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
                <SelectItem value="MISSED">Missed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isWalkIn"
            name="isWalkIn"
            checked={formData.isWalkIn}
            onChange={handleCheckboxChange}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isWalkIn" className="text-sm font-medium cursor-pointer">
            Walk-in Visit
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : visitToEdit ? "Save Changes" : "Schedule Visit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
