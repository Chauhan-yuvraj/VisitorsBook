import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Search, Plus, Filter } from "lucide-react-native";

import { useEmployees } from "@/hooks/Dashboard/employees/useEmployees";
import { EmployeeCard } from "./EmployeeCard";
import EmployeeForm from "./EmployeeForm";
import { Employee } from "@/store/types/user";
import { useAppDispatch } from "@/store/hooks";
import {
  addEmployeeThunk,
  fetchEmployeesThunk,
} from "@/store/slices/employees.slice";

export default function EmployeesList() {
  const dispatch = useAppDispatch();
  const { searchQuery, setSearchQuery, employees, loading } = useEmployees();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const openCreateForm = () => {
    setSelectedEmployee(null);
    setIsFormVisible(true);
  };

  const openEditForm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (formData: Partial<Employee>) => {
    try {
      if (selectedEmployee) {
        console.log("Updating:", selectedEmployee._id, formData);
      } else {
        console.log("Creating:", formData);
        await dispatch(addEmployeeThunk(formData));
      }

      setIsFormVisible(false);
      dispatch(fetchEmployeesThunk());
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-12 px-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Employees</Text>
          <Text className="text-gray-500 text-sm">
            {employees.length} team members
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-lg flex-row items-center"
          onPress={openCreateForm}
        >
          <Plus size={18} color="white" />
          <Text className="text-white font-medium ml-2">Add Employee</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="flex-row mb-6 gap-3">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-lg px-3 h-12">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search by name, role..."
            className="flex-1 ml-2 text-gray-700 h-full"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity className="w-12 h-12 bg-white border border-gray-200 rounded-lg items-center justify-center">
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <EmployeeCard item={item} onEdit={openEditForm} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-10">
              <Text className="text-gray-400">No employees found.</Text>
            </View>
          }
        />
      )}

      {/* Form Modal */}
      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsFormVisible(false)}
      >
        <EmployeeForm
          visible={isFormVisible}
          initialData={selectedEmployee}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={loading}
        />
      </Modal>
    </View>
  );
}
