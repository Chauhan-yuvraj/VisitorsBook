import React from "react";
import { User } from "lucide-react";
import type { Employee } from "@/types/user";

interface EmployeeGridProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  onEmployeeClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <div
          key={employee._id}
          onClick={() => onEmployeeClick(employee)}
          className="group relative flex flex-col items-center p-6 bg-card text-card-foreground rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4 overflow-hidden">
            {employee.profileImgUri ? (
              <img
                src={employee.profileImgUri}
                alt={employee.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <h3 className="font-semibold text-lg text-center">{employee.name}</h3>
          <p className="text-sm text-muted-foreground text-center mb-1">
            {employee.jobTitle}
          </p>
          <div className="flex justify-center flex-wrap gap-2">
            {Array.isArray(employee.departments) &&
            employee.departments.length > 0 ? (
              employee.departments.map((dept, index) => {
                const label: string =
                  typeof dept === "string" ? dept : dept.departmentName;

                return (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                     transition-colors focus:outline-none focus:ring-2 focus:ring-ring
                     focus:ring-offset-2 border-transparent bg-secondary
                     text-secondary-foreground hover:bg-secondary/80"
                  >
                    {label}
                  </span>
                );
              })
            ) : (
              <span className="text-xs text-muted-foreground">N/A</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
