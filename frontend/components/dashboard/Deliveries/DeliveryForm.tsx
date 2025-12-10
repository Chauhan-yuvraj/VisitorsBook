import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { X, Package, Truck, User } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEmployeesThunk } from "@/store/slices/employees.slice";
import { createDeliveryThunk } from "@/store/slices/delivery.slice";
import { SelectionList } from "@/components/ui/SelectionList";
import { CreateDeliveryPayload } from "@/store/types/delivery";

interface DeliveryFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

const CARRIERS = ["DHL", "FEDEX", "UPS", "AMAZON", "FOOD", "OTHER"];

export default function DeliveryForm({ visible, onClose, onSubmit }: DeliveryFormProps) {
    const dispatch = useAppDispatch();
    const { employees } = useAppSelector(state => state.employees);
    const [selectingRecipient, setSelectingRecipient] = useState(false);

    const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateDeliveryPayload>({
        defaultValues: {
            recipientId: "",
            carrier: "OTHER",
            trackingNumber: "",
        }
    });

    const selectedRecipientId = watch("recipientId");
    const selectedRecipient = employees.find(e => e._id === selectedRecipientId);
    const selectedCarrier = watch("carrier");

    useEffect(() => {
        if (visible) {
            dispatch(fetchEmployeesThunk());
        }
    }, [visible, dispatch]);

    const submitHandler = async (data: CreateDeliveryPayload) => {
        try {
            await dispatch(createDeliveryThunk(data)).unwrap();
            Alert.alert("Success", "Delivery logged successfully");
            reset();
            if (onSubmit) onSubmit();
            onClose();
        } catch (error) {
            Alert.alert("Error", "Failed to log delivery");
        }
    };

    if (!visible) return null;

    if (selectingRecipient) {
        return (
            <Modal visible={true} animationType="slide">
                <SelectionList
                    data={employees}
                    onSelect={(employee) => {
                        setValue("recipientId", employee._id);
                        setSelectingRecipient(false);
                    }}
                    onClose={() => setSelectingRecipient(false)}
                    title="Select Recipient"
                    searchKeys={['name', 'email', 'department']}
                    renderItem={(employee) => (
                        <View>
                            <Text className="font-medium text-gray-900">{employee.name}</Text>
                            <Text className="text-xs text-gray-500">{employee.department}</Text>
                        </View>
                    )}
                />
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
                <View className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-gray-900">Log Delivery</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Recipient Selection */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Recipient</Text>
                            <TouchableOpacity
                                onPress={() => setSelectingRecipient(true)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg flex-row justify-between items-center bg-white"
                            >
                                {selectedRecipient ? (
                                    <View className="flex-row items-center">
                                        <User size={20} color="#4F46E5" className="mr-2" />
                                        <Text className="text-gray-900">{selectedRecipient.name}</Text>
                                    </View>
                                ) : (
                                    <Text className="text-gray-400">Select Employee</Text>
                                )}
                            </TouchableOpacity>
                            <Controller
                                control={control}
                                name="recipientId"
                                rules={{ required: "Recipient is required" }}
                                render={() => <View />}
                            />
                            {errors.recipientId && <Text className="text-red-500 text-xs mt-1">{errors.recipientId.message}</Text>}
                        </View>

                        {/* Carrier Selection */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Carrier</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {CARRIERS.map((carrier) => (
                                    <TouchableOpacity
                                        key={carrier}
                                        onPress={() => setValue("carrier", carrier)}
                                        className={`px-3 py-2 rounded-lg border ${
                                            selectedCarrier === carrier
                                                ? "bg-primary/10 border-primary"
                                                : "bg-white border-gray-200"
                                        }`}
                                    >
                                        <Text className={`text-xs font-medium ${
                                            selectedCarrier === carrier ? "text-primary" : "text-gray-600"
                                        }`}>
                                            {carrier}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Tracking Number */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-1">Tracking Number (Optional)</Text>
                            <Controller
                                control={control}
                                name="trackingNumber"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                                        <Package size={20} color="#9CA3AF" className="mr-2" />
                                        <TextInput
                                            className="flex-1 py-3 text-gray-900"
                                            placeholder="Enter tracking number"
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    </View>
                                )}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit(submitHandler)}
                            className="w-full bg-primary py-3 rounded-xl active:bg-primary/90 items-center"
                        >
                            <Text className="text-white font-semibold text-base">Log Delivery</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
