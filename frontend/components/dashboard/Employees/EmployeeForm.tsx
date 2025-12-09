import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
} from "lucide-react-native";
import { Employee, UserRole } from "@/store/types/user";

interface EmployeeFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => void;
  initialData?: Employee | null; // If provided, we are in "Edit" mode
  isSubmitting?: boolean;
}

export default function EmployeeForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: EmployeeFormProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    role: "employee" as UserRole | string,
    isActive: true,
  });

  // Load initial data when editing
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
      });
    } else {
      // Reset form for "Add New"
      setFormData({
        name: "suyash Gehlot",
        email: "suyash.gehlot@abhyuday.in",
        phone: "9265753207",
        jobTitle: "Jr. Software Engineer",
        department: "IT",
        role: "employee",
        isActive: true,
      });
    }
  }, [initialData, visible]);

  if (!visible) return null;

  const handleSubmit = () => {
    // Basic Validation
    if (!formData.name || !formData.email || !formData.jobTitle) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Email, Job Title)."
      );
      return;
    }

    // Pass data back to parent
    onSubmit(formData);
  };

  // Reusable Input Component
  const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: Icon,
    keyboardType = "default" as any,
  }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
      <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-12 focus:border-primary">
        <Icon size={18} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-3 text-gray-900 text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#D1D5DB"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <View className="absolute inset-0 z-50 bg-black/50 flex-1 justify-end">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <View className="bg-surface rounded-t-3xl h-[85%] shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100 bg-white rounded-t-3xl">
            <View>
              <Text className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Employee" : "New Employee"}
              </Text>
              <Text className="text-sm text-gray-500">
                {initialData
                  ? "Update employee details below"
                  : "Fill in the information to add a new member"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Personal Info Section */}
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Personal Information
            </Text>

            <FormInput
              label="Full Name *"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChangeText={(t: string) =>
                setFormData({ ...formData, name: t })
              }
              icon={User}
            />
            <FormInput
              label="Email Address *"
              placeholder="e.g. rahul@company.com"
              value={formData.email}
              onChangeText={(t: string) =>
                setFormData({ ...formData, email: t })
              }
              icon={Mail}
              keyboardType="email-address"
            />
            <FormInput
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChangeText={(t: string) =>
                setFormData({ ...formData, phone: t })
              }
              icon={Phone}
              keyboardType="phone-pad"
            />

            {/* Role Section */}
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2">
              Role & Department
            </Text>

            <FormInput
              label="Job Title *"
              placeholder="e.g. Software Engineer"
              value={formData.jobTitle}
              onChangeText={(t: string) =>
                setFormData({ ...formData, jobTitle: t })
              }
              icon={Briefcase}
            />

            <FormInput
              label="Department"
              placeholder="e.g. Engineering"
              value={formData.department}
              onChangeText={(t: string) =>
                setFormData({ ...formData, department: t })
              }
              icon={Building}
            />

            {/* Role Selector (Pills) */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Access Role
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {["employee", "hr", "admin", "executive"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setFormData({ ...formData, role: role })}
                    className={`px-4 py-2 rounded-full border ${
                      formData.role === role
                        ? "bg-black border-black"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`capitalize text-sm font-medium ${
                        formData.role === role ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Active Status Switch */}
            <View className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mb-8">
              <View>
                <Text className="text-base font-semibold text-gray-900">
                  Active Account
                </Text>
                <Text className="text-xs text-gray-500">
                  Enable or disable access
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                thumbColor={"#FFFFFF"}
                onValueChange={(val) =>
                  setFormData({ ...formData, isActive: val })
                }
                value={formData.isActive}
              />
            </View>

            {/* Bottom Padding for Scroll */}
            <View className="h-24" />
          </ScrollView>

          {/* Footer Actions */}
          <View className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-6 flex-row gap-4 rounded-t-3xl pb-10">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 py-4 rounded-xl items-center justify-center"
            >
              <Text className="font-bold text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-4 rounded-xl items-center justify-center flex-row ${
                isSubmitting ? "bg-gray-400" : "bg-black"
              }`}
            >
              <Save size={18} color="white" className="mr-2" />
              <Text className="font-bold text-white">
                {isSubmitting ? "Saving..." : "Save Details"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
