import React, { useState, useMemo } from "react";
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
}

export const StepHostParticipants: React.FC<StepHostParticipantsProps> = ({
  formData,
  employees,
  departments,
  onHostChange,
  onParticipantToggle,
  onDepartmentToggle,
}) => {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  // Group employees by department
  const employeesByDepartment = useMemo(() => {
    const grouped: Record<string, Employee[]> = {};
    departments.forEach(dept => {
      grouped[dept._id || ""] = [];
    });

    employees.forEach(employee => {
      if (employee.departments) {
        const deptIds = Array.isArray(employee.departments)
          ? employee.departments.map(d => typeof d === 'string' ? d : d._id)
          : [];
        deptIds.forEach(deptId => {
          if (grouped[deptId]) {
            grouped[deptId].push(employee);
          }
        });
      }
    });

    return grouped;
  }, [employees, departments]);

  const toggleDepartmentExpansion = (departmentId: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const handleDepartmentCheckboxChange = (departmentId: string, checked: boolean) => {
    const deptEmployees = employeesByDepartment[departmentId] || [];
    
    if (checked) {
      // Add department to selected departments
      onDepartmentToggle(departmentId);
      // Add all employees in this department to participants
      deptEmployees.forEach(employee => {
        if (!formData.participants.includes(employee._id || "")) {
          onParticipantToggle(employee._id || "");
        }
      });
    } else {
      // Remove department from selected departments
      onDepartmentToggle(departmentId);
      // Remove employees that are only in this department (not in other selected departments)
      deptEmployees.forEach(employee => {
        const employeeId = employee._id || "";
        const employeeDeptIds = Array.isArray(employee.departments)
          ? employee.departments.map(d => typeof d === 'string' ? d : d._id)
          : [];
        
        // Check if employee is in any other selected department
        const otherSelectedDepts = formData.departments.filter(id => id !== departmentId);
        const isInOtherSelectedDept = employeeDeptIds.some(deptId => otherSelectedDepts.includes(deptId));
        
        if (!isInOtherSelectedDept && formData.participants.includes(employeeId)) {
          onParticipantToggle(employeeId);
        }
      });
    }
  };

  const handleEmployeeCheckboxChange = (employeeId: string) => {
    onParticipantToggle(employeeId);

    // Update department checkboxes based on whether all employees in each department are selected
    departments.forEach(dept => {
      const deptEmployees = employeesByDepartment[dept._id || ""] || [];
      const allSelected = deptEmployees.every(emp => formData.participants.includes(emp._id || ""));
      const isDeptSelected = formData.departments.includes(dept._id || "");
      
      if (allSelected && !isDeptSelected) {
        onDepartmentToggle(dept._id || "");
      } else if (!allSelected && isDeptSelected) {
        onDepartmentToggle(dept._id || "");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Step 1: Meeting Setup</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Select host and participants by department.
        </p>
      </div>

      {/* Host Selection */}
      <div className="space-y-2">
        <Label htmlFor="hostId" className="text-sm font-medium">Host *</Label>
        <Select value={formData.hostId} onValueChange={onHostChange}>
          <SelectTrigger className={`w-full ${!formData.hostId ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Select host" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee._id} value={employee._id || ""}>
                <div className="flex flex-col">
                  <span className="font-medium">{employee.name}</span>
                  <span className="text-xs text-muted-foreground">{employee.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!formData.hostId && (
          <p className="text-xs text-destructive mt-1">
            Please select a host for the meeting.
          </p>
        )}
      </div>

      {/* Department and Participant Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Departments & Participants *</Label>
        <div className="max-h-96 overflow-y-auto border rounded-lg p-4 space-y-3 bg-gray-50/50">
          {departments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No departments available
            </p>
          ) : (
            departments.map((department) => {
              const deptEmployees = employeesByDepartment[department._id || ""] || [];
              const isDeptSelected = formData.departments.includes(department._id || "");
              const isExpanded = expandedDepartments.has(department._id || "");

              return (
                <div key={department._id} className="bg-white rounded-lg border shadow-sm">
                  {/* Department Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isDeptSelected}
                          onChange={(e) => handleDepartmentCheckboxChange(department._id || "", e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {department.departmentName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {deptEmployees.length} employee{deptEmployees.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleDepartmentExpansion(department._id || "")}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Employees in Department */}
                  {isExpanded && (
                    <div className="p-4 space-y-2">
                      {deptEmployees.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No employees in this department
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
                          {deptEmployees.map((employee) => (
                            <label
                              key={`${department._id}-${employee._id}`}
                              className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer border"
                            >
                              <input
                                type="checkbox"
                                checked={formData.participants.includes(employee._id || "")}
                                onChange={() => handleEmployeeCheckboxChange(employee._id || "")}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{employee.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {employee.email}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {formData.departments.length === 0 && formData.participants.length === 0 && (
          <p className="text-xs text-destructive mt-1">
            Please select at least one department or participant.
          </p>
        )}
      </div>
    </div>
  );
};
