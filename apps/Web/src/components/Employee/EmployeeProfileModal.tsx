import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, Building, Shield, Trash2, Edit } from "lucide-react";
import type { Employee } from "@/types/user";

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

export default function EmployeeProfileModal({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete,
}: EmployeeProfileModalProps) {
  if (!employee) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      onDelete(employee._id || "");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Profile">
      <div className="flex flex-col items-center space-y-6">
        {/* Profile Image */}
        <div className="relative h-32 w-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
          {employee.profileImgUri ? (
            <img
              src={employee.profileImgUri}
              alt={employee.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-muted-foreground" />
          )}
        </div>

        {/* Name and Role */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
          <p className="text-muted-foreground font-medium">{employee.jobTitle}</p>
          <div className="flex justify-center pt-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                employee.isActive
                  ? "bg-green-50 text-green-700 ring-green-600/20"
                  : "bg-red-50 text-red-700 ring-red-600/20"
              }`}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg">
          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium truncate" title={employee.email}>
                {employee.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{employee.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Building className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium">{employee.department || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2 bg-background rounded-full shadow-sm">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium capitalize">{employee.role}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button className="flex-1 gap-2" onClick={() => onEdit(employee)}>
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
}
