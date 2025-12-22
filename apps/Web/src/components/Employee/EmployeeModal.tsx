import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole, type Employee } from "@/types/user";
import { Loader2 } from "lucide-react";
import { useEmployeeForm } from "@/hooks/useEmployeeForm";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  employeeToEdit,
}: EmployeeModalProps) {
  const {
    formData,
    isLoading,
    createdPassword,
    handleChange,
    handleRoleChange,
    handleFileChange,
    handleSubmit,
  } = useEmployeeForm({ employeeToEdit, isOpen, onClose });

  if (createdPassword) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Employee Created Successfully"
      >
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800 mb-2">
              The employee has been created. Please share these credentials with them immediately as the password will not be shown again.
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email: <span className="font-normal">{formData.email}</span></p>
              <p className="text-sm font-medium">Password: <span className="font-mono bg-white px-2 py-1 rounded border select-all">{createdPassword}</span></p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? "Edit Employee" : "Add New Employee"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profileImg">Profile Image</Label>
          <Input
            id="profileImg"
            name="profileImg"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Engineering"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UserRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {employeeToEdit ? "Update Employee" : "Add Employee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
