import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Modal from "@/components/ui/Modal";
import { usePermission } from "@/hooks/auth/usePermission";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "@/services/department.service";
import { Trash2, Edit2 } from "lucide-react";
import type { IDepartment } from "@repo/types";

export default function Departments() {
  const { hasPermission } = usePermission();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<IDepartment | null>(null);
  const [formData, setFormData] = useState({ departmentName: "", departmentCode: "" });

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenModal = (department?: IDepartment) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({ departmentName: department.departmentName, departmentCode: department.departmentCode });
    } else {
      setEditingDepartment(null);
      setFormData({ departmentName: "", departmentCode: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
    setFormData({ departmentName: "", departmentCode: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment && editingDepartment._id) {
        await updateDepartment(editingDepartment._id, formData);
      } else {
        await createDepartment(formData);
      }
      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving department", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department", error);
      }
    }
  };

  const canManage = hasPermission('manage_departments');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Departments" 
        description="Manage organization departments." 
        actionLabel={canManage ? "Add Department" : undefined} 
        onAction={canManage ? () => handleOpenModal() : undefined} 
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.departmentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.departmentCode}</td>
                {canManage && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(dept)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => dept._id && handleDelete(dept._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {departments.length === 0 && !isLoading && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No departments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDepartment ? "Edit Department" : "Add Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="departmentName">Department Name</Label>
            <Input
              id="departmentName"
              value={formData.departmentName}
              onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="departmentCode">Department Code</Label>
            <Input
              id="departmentCode"
              value={formData.departmentCode}
              onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingDepartment ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
