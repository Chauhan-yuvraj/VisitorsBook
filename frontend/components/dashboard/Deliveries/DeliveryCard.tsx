import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Truck, CheckCircle, XCircle, RotateCcw } from "lucide-react-native";
import { Delivery } from "@/store/types/delivery";
import { format } from "date-fns";

interface DeliveryCardProps {
    item: Delivery;
    onUpdateStatus: (id: string, status: string) => void;
}

export const DeliveryCard = ({ item, onUpdateStatus }: DeliveryCardProps) => {
    const isPending = item.status === "PENDING";
    const isRejected = item.status === "REJECTED" || item.status === "RETURNED";
    const isCollected = item.status === "COLLECTED";

    return (
        <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm flex-col">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {/* Icon based on Carrier */}
                    <View className={`h-12 w-12 rounded-full items-center justify-center border overflow-hidden mr-4 ${
                        item.carrier === 'AMAZON' ? 'bg-orange-50 border-orange-100' :
                        item.carrier === 'DHL' ? 'bg-yellow-50 border-yellow-100' :
                        item.carrier === 'FEDEX' ? 'bg-purple-50 border-purple-100' :
                        'bg-gray-50 border-gray-100'
                    }`}>
                        <Truck size={20} color="#6B7280" />
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <Text className="text-gray-900 font-semibold text-base mr-2">
                                {item.recipientId?.name || "Unknown Recipient"}
                            </Text>
                            <View className={`px-2 py-0.5 rounded-full ${
                                isPending ? "bg-yellow-100" : 
                                isCollected ? "bg-green-100" : "bg-red-100"
                            }`}>
                                <Text className={`text-xs font-medium ${
                                    isPending ? "text-yellow-700" : 
                                    isCollected ? "text-green-700" : "text-red-700"
                                }`}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                        
                        <View className="flex-row items-center">
                            <Text className="text-gray-500 text-sm mr-3">
                                {item.carrier}
                            </Text>
                            {item.trackingNumber && (
                                <Text className="text-gray-400 text-xs bg-gray-50 px-1.5 py-0.5 rounded">
                                    #{item.trackingNumber}
                                </Text>
                            )}
                        </View>
                        
                        <Text className="text-gray-400 text-xs mt-1">
                            Arrived: {format(new Date(item.createdAt), "MMM dd, hh:mm a")}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Actions Row */}
            <View className="flex-row justify-end mt-3 gap-2 border-t border-gray-50 pt-3">
                {isPending ? (
                    <>
                        <TouchableOpacity
                            onPress={() => onUpdateStatus(item._id, "REJECTED")}
                            className="bg-red-50 px-3 py-2 rounded-lg flex-row items-center"
                        >
                            <XCircle size={16} color="#EF4444" className="mr-1" />
                            <Text className="text-red-600 font-medium text-xs">Reject</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onUpdateStatus(item._id, "COLLECTED")}
                            className="bg-green-50 px-3 py-2 rounded-lg flex-row items-center"
                        >
                            <CheckCircle size={16} color="#10B981" className="mr-1" />
                            <Text className="text-green-600 font-medium text-xs">Collect</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={() => onUpdateStatus(item._id, "PENDING")}
                        className="bg-gray-100 px-3 py-2 rounded-lg flex-row items-center"
                    >
                        <RotateCcw size={16} color="#6B7280" className="mr-1" />
                        <Text className="text-gray-600 font-medium text-xs">Mark as Pending</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
