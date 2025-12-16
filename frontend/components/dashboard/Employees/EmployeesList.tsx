import { Filter, Plus, Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEmployees } from "@/hooks/Dashboard/employees/useEmployees";
import { useEmployeeActions } from "@/hooks/Dashboard/employees/useEmployeeActions";
import { Employee , UserRole } from "@/store/types/user";
import { EmployeeCard } from "./EmployeeCard";
import EmployeeForm from "./EmployeeForm";
import { useRefresh } from "@/hooks/useRefresh";

export default function EmployeesList() {
  const { searchQuery, setSearchQuery, employees, loading, filterRole, setFilterRole, refetch } = useEmployees();
  const { refreshing, onRefresh } = useRefresh(refetch);

  // Local state to manage modal visibility and selected employee
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const { handleCreate, handleUpdate, handleDelete } = useEmployeeActions(() => {
    setIsFormVisible(false);
    setSelectedEmployee(null);
  });

  /** Open form for creating a new employee */
  const openCreateForm = () => {
    setSelectedEmployee(null);
    setIsFormVisible(true);
  };

  /** Open form for editing an existing employee */
  const openEditForm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormVisible(true);
  };

  /** Handle form submission for add/update */
  const handleFormSubmit = async (formData: Partial<Employee> | FormData) => {
    if (selectedEmployee) {
      await handleUpdate(selectedEmployee._id, formData);
    } else {
      await handleCreate(formData);
    }
  };

  const ROLES = Object.values(UserRole);

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

      {/* Search Bar & Filter */}
      <View className="flex-col mb-6">
        <View className="flex-row gap-3">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-lg px-3 h-12">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search by name, role..."
              className="flex-1 ml-2 text-gray-700 h-full"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity 
            onPress={() => setIsFilterVisible(!isFilterVisible)}
            className={`w-12 h-12 border rounded-lg items-center justify-center ${isFilterVisible || filterRole ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
          >
            <Filter size={20} color={isFilterVisible || filterRole ? "white" : "#6B7280"} />
          </TouchableOpacity>
        </View>

        {/* Filter Options */}
        {isFilterVisible && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            <TouchableOpacity
              onPress={() => setFilterRole(null)}
              className={`px-3 py-1.5 rounded-full border ${!filterRole ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-200'}`}
            >
              <Text className={`text-xs font-medium ${!filterRole ? 'text-white' : 'text-gray-600'}`}>All</Text>
            </TouchableOpacity>
            {ROLES.map(role => (
              <TouchableOpacity
                key={role}
                onPress={() => setFilterRole(role === filterRole ? null : role)}
                className={`px-3 py-1.5 rounded-full border ${role === filterRole ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
              >
                <Text className={`text-xs font-medium ${role === filterRole ? 'text-white' : 'text-gray-600'}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Employees List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <EmployeeCard
              item={item}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
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

      {/* Modal Form */}
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
