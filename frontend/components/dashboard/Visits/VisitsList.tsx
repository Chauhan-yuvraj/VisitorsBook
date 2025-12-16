import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { useVisits } from "@/hooks/Dashboard/visits/useVisits";
import { useVisitActions } from "@/hooks/Dashboard/visits/useVisitActions";
import { VisitCard } from "./VisitCard";
import VisitForm from "./VisitForm";
import { Plus, Search, Filter } from "lucide-react-native";
import { Visit } from "@/store/types/visit";
import { DateFilter } from "../DateFilter";
import { useRefresh } from "@/hooks/useRefresh";

const STATUS_FILTERS = [
  "PENDING",
  "CHECKED_IN",
  "CHECKED_OUT",
  "DECLINED",
  "MISSED",
];

export default function VisitsList() {
  const {
    visits,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    refetch,
  } = useVisits();
  const { refreshing, onRefresh } = useRefresh(refetch);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const { handleCreate, handleUpdate, handleDelete } = useVisitActions(() => {
    setIsFormVisible(false);
    setSelectedVisit(null);
  });

  const openCreateForm = () => {
    setSelectedVisit(null);
    setIsFormVisible(true);
  };

  const openEditForm = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsFormVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Visits</Text>
          <Text className="text-gray-500 text-sm">
            Manage scheduled and walk-in visits
          </Text>
        </View>
        <TouchableOpacity
          onPress={openCreateForm}
          className="bg-primary flex-row items-center px-4 py-2.5 rounded-xl shadow-sm active:bg-primary/90"
        >
          <Plus size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold">Schedule Visit</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View className="flex-col mb-6">
        <View className="flex-row gap-x-3">
          <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-12">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="Search visits..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsFilterVisible(!isFilterVisible)}
            className={`w-12 h-12 border rounded-xl items-center justify-center ${
              isFilterVisible || statusFilter
                ? "bg-primary border-primary"
                : "bg-white border-gray-200"
            }`}
          >
            <Filter
              size={20}
              color={isFilterVisible || statusFilter ? "white" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
        <DateFilter 
          startDate={startDate} 
          endDate={endDate} 
          onFilterChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }} 
        />
        {/* Filter Options */}
        {isFilterVisible && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            <TouchableOpacity
              onPress={() => setStatusFilter(null)}
              className={`px-3 py-1.5 rounded-full border ${
                !statusFilter
                  ? "bg-gray-800 border-gray-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  !statusFilter ? "text-white" : "text-gray-600"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>
            {STATUS_FILTERS.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() =>
                  setStatusFilter(status === statusFilter ? null : status)
                }
                className={`px-3 py-1.5 rounded-full border ${
                  status === statusFilter
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    status === statusFilter ? "text-white" : "text-gray-600"
                  }`}
                >
                  {status.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* List */}
      {loading === 'pending' && visits.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <VisitCard
              visit={item}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-400">No visits found</Text>
            </View>
          }
        />
      )}

      {/* Modal Form */}
      <Modal
        visible={isFormVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFormVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <VisitForm
            initialData={selectedVisit}
            onSubmit={(data) =>
              selectedVisit
                ? handleUpdate(selectedVisit._id, data)
                : handleCreate(data)
            }
            onCancel={() => setIsFormVisible(false)}
            isUpdating={!!selectedVisit}
          />
        </View>
      </Modal>
    </View>
  );
}
