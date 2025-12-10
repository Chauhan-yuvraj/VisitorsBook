import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Employee, UserRole } from "@/store/types/user";
import { useImagePicker } from "@/hooks/useImagePicker";

interface UseEmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: Partial<Employee> | FormData) => void;
  visible: boolean;
}

export const useEmployeeForm = ({
  initialData,
  onSubmit,
  visible,
}: UseEmployeeFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    role: "employee" as UserRole | string,
    isActive: true,
    profileImgUri: "",
  });

  const [imageUri, setImageUri] = useState<string | null>(null);

  const { handleTakePhoto, handleChooseFromGallery } = useImagePicker((uri) => {
    if (uri) setImageUri(uri);
  });

  const showImagePickerOptions = () => {
    Alert.alert("Profile Photo", "Choose an option", [
      { text: "Camera", onPress: handleTakePhoto },
      { text: "Gallery", onPress: handleChooseFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        jobTitle: initialData.jobTitle || "",
        department: initialData.department || "",
        role: initialData.role || "employee",
        isActive: initialData.isActive ?? true,
        profileImgUri: initialData.profileImgUri || "",
      });
      setImageUri(initialData.profileImgUri || null);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        department: "",
        role: "employee",
        isActive: true,
        profileImgUri: "",
      });
      setImageUri(null);
    }
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.jobTitle) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Email, Job Title)."
      );
      return;
    }

    const hasNewImage = imageUri && !imageUri.startsWith("http");

    if (hasNewImage) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("jobTitle", formData.jobTitle);
      data.append("department", formData.department);
      data.append("role", formData.role);
      data.append("isActive", String(formData.isActive));

      // @ts-ignore
      data.append("profileImg", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      onSubmit(data);
    } else {
      onSubmit({ ...formData, profileImgUri: imageUri || "" });
    }
  };

  return {
    formData,
    setFormData,
    imageUri,
    showImagePickerOptions,
    handleSubmit,
  };
};
