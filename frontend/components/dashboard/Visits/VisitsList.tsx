import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal } from "react-native";
import { useVisits } from "@/hooks/Dashboard/visits/useVisits";
import { useVisitActions } from "@/hooks/Dashboard/visits/useVisitActions";
import { VisitCard } from "./VisitCard";
import VisitForm from "./VisitForm";
import { Plus, Search, Filter } from "lucide-react-native";
import { Visit, CreateVisitPayload } from "@/store/types/visit";

export default function VisitsList() {
    const { visits, loading, searchQuery, setSearchQuery } = useVisits();
    const [isFormVisible, setIsFormVisible] = useState(false);
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
                    <Text className="text-gray-500 text-sm">Manage scheduled and walk-in visits</Text>
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
            <View className="flex-row gap-x-3 mb-6">
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
                <TouchableOpacity className="w-12 h-12 bg-white border border-gray-200 rounded-xl items-center justify-center">
                    <Filter size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* List */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={visits}
                    keyExtractor={(item) => item._id}
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
                        onSubmit={(data) => selectedVisit ? handleUpdate(selectedVisit._id, data) : handleCreate(data)}
                        onCancel={() => setIsFormVisible(false)}
                        isUpdating={!!selectedVisit}
                    />
                </View>
            </Modal>
        </View>
    );
}
