import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Visit } from "@/store/types/visit";
import { Calendar, Clock, User, Briefcase, Trash2, Edit } from "lucide-react-native";
// eslint-disable-next-line import/no-unresolved
import { format } from "date-fns";
import { getStatusColor, getStatusLabel } from "@/utils/visit.utils";

interface VisitCardProps {
    visit: Visit;
    onEdit: (visit: Visit) => void;
    onDelete: (visit: Visit) => void;
}

export const VisitCard: React.FC<VisitCardProps> = ({ visit, onEdit, onDelete }) => {
    const statusColorClass = getStatusColor(visit.status);
    // Extract bg and text classes for separate application if needed, 
    // but here we can just apply them to the container and text respectively if we split them.
    // The util returns a string like "bg-yellow-100 text-yellow-800 border-yellow-200"
    // We need to parse this or adjust the util. 
    // Let's adjust the usage to split the string since NativeWind might need specific class application.
    
    const [bgClass, textClass] = statusColorClass.split(' ');

    return (
        <View className="bg-white p-4 rounded-xl border border-gray-100 mb-3 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                    <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                        <User size={20} className="text-primary" color="#4F46E5" />
                    </View>
                    <View>
                        <Text className="font-semibold text-gray-900 text-base">{visit.visitor.name}</Text>
                        <Text className="text-gray-500 text-xs">{visit.visitor.company || 'No Company'}</Text>
                    </View>
                </View>
                <View className={`px-2 py-1 rounded-full ${bgClass}`}>
                    <Text className={`text-xs font-medium ${textClass}`}>
                        {getStatusLabel(visit.status)}
                    </Text>
                </View>
            </View>

            <View className="flex-row flex-wrap gap-y-2 mb-3">
                <View className="flex-row items-center w-1/2 pr-2">
                    <Calendar size={14} className="text-gray-400 mr-1.5" color="#9CA3AF" />
                    <Text className="text-gray-600 text-xs">
                        {format(new Date(visit.scheduledCheckIn), "MMM dd, yyyy")}
                    </Text>
                </View>
                <View className="flex-row items-center w-1/2 pl-2">
                    <Clock size={14} className="text-gray-400 mr-1.5" color="#9CA3AF" />
                    <Text className="text-gray-600 text-xs">
                        {format(new Date(visit.scheduledCheckIn), "hh:mm a")}
                    </Text>
                </View>
                
                {visit.purpose && (
                    <View className="flex-row items-center w-full mt-1 px-1">
                        <Text className="text-gray-600 text-xs italic">
                            Topic: {visit.purpose}
                        </Text>
                    </View>
                )}

                <View className="flex-row items-center w-full mt-1">
                    <Briefcase size={14} className="text-gray-400 mr-1.5" color="#9CA3AF" />
                    <Text className="text-gray-600 text-xs">
                        Host: {visit.host.name} ({visit.host.department})
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-end gap-x-2 border-t border-gray-50 pt-3">
                <TouchableOpacity 
                    onPress={() => onEdit(visit)}
                    className="p-2 rounded-lg bg-gray-50 active:bg-gray-100"
                >
                    <Edit size={16} className="text-gray-600" color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onDelete(visit)}
                    className="p-2 rounded-lg bg-red-50 active:bg-red-100"
                >
                    <Trash2 size={16} className="text-red-600" color="#DC2626" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
