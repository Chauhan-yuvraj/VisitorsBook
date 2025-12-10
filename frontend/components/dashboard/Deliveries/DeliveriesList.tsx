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
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

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

        const matchesSearch = 
            recipientName.toLowerCase().includes(query) ||
            tracking.toLowerCase().includes(query) ||
            carrier.toLowerCase().includes(query);

        const matchesStatus = statusFilter ? d.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    const STATUS_FILTERS = ["PENDING", "COLLECTED", "RETURNED", "REJECTED"];

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

            {/* Search Bar & Filter */}
            <View className="flex-col mb-6">
                <View className="flex-row gap-3">
                    <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-lg px-3 h-12">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search recipient, carrier, tracking..."
                            className="flex-1 ml-2 text-gray-700 h-full"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    
                    <TouchableOpacity 
                        onPress={() => setIsFilterVisible(!isFilterVisible)}
                        className={`w-12 h-12 border rounded-lg items-center justify-center ${isFilterVisible || statusFilter ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-200'}`}
                    >
                        <Filter size={20} color={isFilterVisible || statusFilter ? "white" : "#6B7280"} />
                    </TouchableOpacity>
                </View>

                {/* Filter Options */}
                {isFilterVisible && (
                    <View className="flex-row flex-wrap gap-2 mt-3">
                        <TouchableOpacity
                            onPress={() => setStatusFilter(null)}
                            className={`px-3 py-1.5 rounded-full border ${!statusFilter ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-200'}`}
                        >
                            <Text className={`text-xs font-medium ${!statusFilter ? 'text-white' : 'text-gray-600'}`}>All</Text>
                        </TouchableOpacity>
                        {STATUS_FILTERS.map(status => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => setStatusFilter(status === statusFilter ? null : status)}
                                className={`px-3 py-1.5 rounded-full border ${status === statusFilter ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-200'}`}
                            >
                                <Text className={`text-xs font-medium ${status === statusFilter ? 'text-white' : 'text-gray-600'}`}>
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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
