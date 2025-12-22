import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addVisitor, updateVisitor } from "@/store/slices/visitorSlice";
import type { Visitor } from "@/types/visitor";

interface UseVisitorFormProps {
  visitorToEdit?: Visitor | null;
  onClose: () => void;
  isOpen: boolean;
}

export const useVisitorForm = ({ visitorToEdit, onClose, isOpen }: UseVisitorFormProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyNameFallback: "",
    notes: "",
    isVip: false,
    isBlocked: false,
  });

  useEffect(() => {
    if (visitorToEdit) {
      setFormData({
        name: visitorToEdit.name || "",
        email: visitorToEdit.email || "",
        phone: visitorToEdit.phone || "",
        companyNameFallback: visitorToEdit.companyNameFallback || "",
        notes: visitorToEdit.notes || "",
        isVip: visitorToEdit.isVip || false,
        isBlocked: visitorToEdit.isBlocked || false,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyNameFallback: "",
        notes: "",
        isVip: false,
        isBlocked: false,
      });
    }
    setSelectedFile(null);
  }, [visitorToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
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
      submitData.append("companyNameFallback", formData.companyNameFallback);
      submitData.append("notes", formData.notes);
      submitData.append("isVip", String(formData.isVip));
      submitData.append("isBlocked", String(formData.isBlocked));

      if (selectedFile) {
        submitData.append("profileImg", selectedFile);
      }

      if (visitorToEdit) {
        await dispatch(
          updateVisitor({ id: visitorToEdit._id, data: submitData })
        ).unwrap();
      } else {
        await dispatch(addVisitor(submitData)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Failed to save visitor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    selectedFile,
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
  };
};
