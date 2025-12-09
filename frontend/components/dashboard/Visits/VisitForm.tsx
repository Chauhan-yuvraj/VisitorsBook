import React, { useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { CreateVisitPayload, Visit } from "@/store/types/visit";
import { X } from "lucide-react-native";

interface VisitFormProps {
    initialData?: Visit | null;
    onSubmit: (data: CreateVisitPayload) => void;
    onCancel: () => void;
    isUpdating?: boolean;
}

export default function VisitForm({ initialData, onSubmit, onCancel, isUpdating = false }: VisitFormProps) {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<CreateVisitPayload>({
        defaultValues: {
            visitorId: initialData?.visitor.id || "",
            hostId: initialData?.host.id || "",
            scheduledCheckIn: initialData?.scheduledCheckIn || new Date().toISOString(),
            isWalkIn: initialData?.isWalkIn || false,
            notes: "",
        }
    });

    useEffect(() => {
        if (initialData) {
            setValue("visitorId", initialData.visitor.id);
            setValue("hostId", initialData.host.id);
            setValue("scheduledCheckIn", initialData.scheduledCheckIn);
            setValue("isWalkIn", initialData.isWalkIn);
        }
    }, [initialData, setValue]);

    const submitHandler = (data: CreateVisitPayload) => {
        onSubmit(data);
    };

    return (
        <View className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">
                    {isUpdating ? "Update Visit" : "Schedule Visit"}
                </Text>
                <TouchableOpacity onPress={onCancel}>
                    <X size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Visitor ID */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Visitor ID</Text>
                    <Controller
                        control={control}
                        name="visitorId"
                        rules={{ required: "Visitor ID is required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter Visitor ID"
                                editable={!isUpdating} // Cannot change visitor on update usually
                            />
                        )}
                    />
                    {errors.visitorId && <Text className="text-red-500 text-xs mt-1">{errors.visitorId.message}</Text>}
                </View>

                {/* Host ID */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Host ID</Text>
                    <Controller
                        control={control}
                        name="hostId"
                        rules={{ required: "Host ID is required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter Host ID"
                                editable={!isUpdating}
                            />
                        )}
                    />
                    {errors.hostId && <Text className="text-red-500 text-xs mt-1">{errors.hostId.message}</Text>}
                </View>

                {/* Scheduled Check-in */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Scheduled Check-in (ISO Date)</Text>
                    <Controller
                        control={control}
                        name="scheduledCheckIn"
                        rules={{ required: "Date is required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                            />
                        )}
                    />
                    {errors.scheduledCheckIn && <Text className="text-red-500 text-xs mt-1">{errors.scheduledCheckIn.message}</Text>}
                </View>

                {/* Is Walk-in */}
                <View className="mb-6 flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-gray-700">Walk-in Visit</Text>
                    <Controller
                        control={control}
                        name="isWalkIn"
                        render={({ field: { onChange, value } }) => (
                            <Switch
                                value={value}
                                onValueChange={onChange}
                                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
                                thumbColor={value ? "#FFFFFF" : "#F3F4F6"}
                            />
                        )}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit(submitHandler)}
                    className="w-full bg-primary py-3 rounded-xl active:bg-primary/90 items-center"
                >
                    <Text className="text-white font-semibold text-base">
                        {isUpdating ? "Update Visit" : "Schedule Visit"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
