import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDeliveriesThunk, updateDeliveryStatusThunk } from "@/store/slices/delivery.slice";
import { DeliveryCard } from "./DeliveryCard";
import { Search, Filter, Package } from "lucide-react-native";
import DeliveryForm from "./DeliveryForm";

export default function DeliveriesList() {
    const dispatch = useAppDispatch();
    const { deliveries, loading } = useAppSelector(state => state.delivery);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchDeliveriesThunk());
    }, [dispatch]);

    const handleUpdateStatus = (id: string, status: string) => {
        dispatch(updateDeliveryStatusThunk({ id, status }));
    };

    const filteredDeliveries = deliveries.filter(d => {
        const query = searchQuery.toLowerCase();
        const recipientName = d.recipientId?.name || "";
        const tracking = d.trackingNumber || "";
        const carrier = d.carrier || "";

        return (
            recipientName.toLowerCase().includes(query) ||
            tracking.toLowerCase().includes(query) ||
            carrier.toLowerCase().includes(query)
        );
    });

    return (
        <View className="flex-1 bg-gray-50 pt-12 px-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-2xl font-bold text-gray-900">Deliveries</Text>
                    <Text className="text-gray-500 text-sm">
                        {deliveries.filter(d => d.status === 'PENDING').length} pending packages
                    </Text>
                </View>

                <TouchableOpacity
                    className="bg-orange-500 px-4 py-2 rounded-lg flex-row items-center"
                    onPress={() => setIsFormVisible(true)}
                >
                    <Package size={18} color="white" />
                    <Text className="text-white font-medium ml-2">Log Package</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="flex-row mb-6 gap-3">
                <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-lg px-3 h-12">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search recipient, carrier, tracking..."
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
            {loading === 'pending' && deliveries.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#F97316" />
                </View>
            ) : (
                <FlatList
                    data={filteredDeliveries}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <DeliveryCard 
                            item={item} 
                            onUpdateStatus={handleUpdateStatus} 
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-10">
                            <Text className="text-gray-400">No deliveries found.</Text>
                        </View>
                    }
                />
            )}

            <DeliveryForm 
                visible={isFormVisible}
                onClose={() => setIsFormVisible(false)}
                onSubmit={() => dispatch(fetchDeliveriesThunk())}
            />
        </View>
    );
}
