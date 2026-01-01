import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addEmployee, updateEmployee } from "@/store/slices/employeeSlice";
import { UserRole, type Employee } from "@/types/user";
import { getDepartments } from "@/services/department.service";
import type { IDepartment } from "@repo/types";

interface UseEmployeeFormProps {
  employeeToEdit?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const useEmployeeForm = ({ employeeToEdit, isOpen, onClose }: UseEmployeeFormProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentIds: [] as string[],
    jobTitle: "",
    role: UserRole.EMPLOYEE as string,
    status: "Active",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deps = await getDepartments();
        setDepartments(deps);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employeeToEdit) {
      const deptIds: string[] = [];
      if (Array.isArray(employeeToEdit.departments)) {
        employeeToEdit.departments.forEach(dept => {
          if (typeof dept === 'string') {
            deptIds.push(dept);
          } else if (dept && dept._id) {
            deptIds.push(dept._id);
          }
        });
      } else if (employeeToEdit.departments && typeof employeeToEdit.departments === 'object' && 'departments' in employeeToEdit.departments) {
        // This shouldn't happen based on types, but just in case
      }
      setFormData({
        name: employeeToEdit.name || "",
        email: employeeToEdit.email || "",
        phone: employeeToEdit.phone || "",
        departmentIds: deptIds,
        jobTitle: employeeToEdit.jobTitle || "",
        role: employeeToEdit.role || UserRole.EMPLOYEE,
        status: employeeToEdit.isActive ? "Active" : "Inactive",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        departmentIds: [],
        jobTitle: "",
        role: UserRole.EMPLOYEE,
        status: "Active",
      });
    }
    setSelectedFile(null);
    setCreatedPassword(null);
  }, [employeeToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };
  const handleDepartmentChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, departmentIds: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      formData.departmentIds.forEach(id => submitData.append("departments", id));
      submitData.append("jobTitle", formData.jobTitle);
      submitData.append("role", formData.role);
      submitData.append("isActive", String(formData.status === "Active"));

      if (selectedFile) {
        submitData.append("profileImg", selectedFile);
      }

      if (employeeToEdit) {
        await dispatch(
          updateEmployee({ id: employeeToEdit._id || "", data: submitData })
        ).unwrap();
        onClose();
      } else {
        const result = await dispatch(addEmployee(submitData)).unwrap();
        if (result && result.password) {
          setCreatedPassword(result.password);
        } else {
          onClose();
        }
      }
    } catch (error) {
      console.error("Failed to save employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    createdPassword,
    departments,
    handleChange,
    handleRoleChange,
    handleDepartmentChange,
    handleFileChange,
    handleSubmit,
  };
};
