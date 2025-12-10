import { Filter, Plus, Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useVisitors } from "@/hooks/Dashboard/visitors/useVisitors";
import { useVisitorActions } from "@/hooks/Dashboard/visitors/useVisitorActions";
import { Visitor } from "@/store/types/visitor";
import { VisitorCard } from "./VisitorCard";
import VisitorForm from "./VisitorForm";

export default function VisitorsList() {
  const { searchQuery, setSearchQuery, visitors, loading, filterType, setFilterType } = useVisitors();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const { handleCreate, handleUpdate, handleDelete } = useVisitorActions(() => {
    setIsFormVisible(false);
    setSelectedVisitor(null);
  });

  const openCreateForm = () => {
    setSelectedVisitor(null);
    setIsFormVisible(true);
  };

  const openEditForm = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (formData: Partial<Visitor>) => {
    if (selectedVisitor) {
      await handleUpdate(selectedVisitor._id, formData);
    } else {
      await handleCreate(formData);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-5 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Visitors</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Manage your visitors and guests
            </Text>
          </View>
          <TouchableOpacity
            onPress={openCreateForm}
            className="bg-primary flex-row items-center px-4 py-2.5 rounded-xl shadow-sm active:opacity-90"
          >
            <Plus size={20} color="white" className="mr-2" />
            <Text className="text-white font-semibold">Add Visitor</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <View className="flex-col">
          <View className="flex-row items-center space-x-3">
            <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <Search size={20} color="#9CA3AF" className="mr-2" />
              <TextInput
                className="flex-1 text-gray-900 text-base"
                placeholder="Search visitors..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity 
              onPress={() => setIsFilterVisible(!isFilterVisible)}
              className={`p-2.5 border rounded-xl ${isFilterVisible || filterType !== 'ALL' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
            >
              <Filter size={20} color={isFilterVisible || filterType !== 'ALL' ? "white" : "#374151"} />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          {isFilterVisible && (
            <View className="flex-row flex-wrap gap-2 mt-3">
              <TouchableOpacity
                onPress={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-full border ${filterType === 'ALL' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
              >
                <Text className={`text-xs font-medium ${filterType === 'ALL' ? 'text-white' : 'text-gray-600'}`}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterType('WITH_COMPANY')}
                className={`px-3 py-1.5 rounded-full border ${filterType === 'WITH_COMPANY' ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
              >
                <Text className={`text-xs font-medium ${filterType === 'WITH_COMPANY' ? 'text-white' : 'text-gray-600'}`}>With Company</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      {loading === "pending" ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={visitors}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VisitorCard
              item={item}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Search size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 font-semibold text-lg">
                No visitors found
              </Text>
              <Text className="text-gray-500 text-center mt-1">
                Try adjusting your search or add a new visitor
              </Text>
            </View>
          }
        />
      )}

      {/* Form Modal */}
      <VisitorForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedVisitor}
      />
    </View>
  );
}
