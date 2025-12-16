import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Image, Platform, Modal } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { CreateVisitPayload, Visit } from "@/store/types/visit";
import { X, ChevronRight, User, Briefcase, Calendar, Clock } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGuestsThunk, createGuestThunk } from "@/store/slices/guest.slice";
import { fetchEmployeesThunk } from "@/store/slices/employees.slice";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";
import { SelectionList } from "@/components/ui/SelectionList";
import { STATUS_OPTIONS } from "@/utils/visit.utils";
import VisitorForm from "../Visitors/VisitorForm";
import { Visitor } from "@/store/types/visitor";

interface VisitFormProps {
    initialData?: Visit | null;
    onSubmit: (data: CreateVisitPayload & { status?: string }) => void;
    onCancel: () => void;
    isUpdating?: boolean;
}

interface VisitFormData extends CreateVisitPayload {
    status?: 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'DECLINED' | 'MISSED';
}

export default function VisitForm({ initialData, onSubmit, onCancel, isUpdating = false }: VisitFormProps) {
    const dispatch = useAppDispatch();
    const { guest: visitors } = useAppSelector(state => state.guest);
    const { employees } = useAppSelector(state => state.employees);

    const [selectingVisitor, setSelectingVisitor] = useState(false);
    const [selectingHost, setSelectingHost] = useState(false);
    const [isCreatingVisitor, setIsCreatingVisitor] = useState(false);
    
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<VisitFormData>({
        defaultValues: {
            visitorId: initialData?.visitor?.id || "",
            hostId: initialData?.host?.id || "",
            scheduledCheckIn: initialData?.scheduledCheckIn || new Date().toISOString(),
            isWalkIn: initialData?.isWalkIn || false,
            purpose: initialData?.purpose || "",
            status: initialData?.status || "PENDING",
        }
    });

    const selectedVisitorId = watch("visitorId");
    const selectedHostId = watch("hostId");
    const currentStatus = watch("status");

    const selectedVisitor = visitors.find(v => v._id === selectedVisitorId) || (initialData?.visitor?.id === selectedVisitorId ? initialData?.visitor : null);
    const selectedHost = employees.find(e => e._id === selectedHostId) || (initialData?.host?.id === selectedHostId ? initialData?.host : null);

    useEffect(() => {
        dispatch(fetchGuestsThunk());
        dispatch(fetchEmployeesThunk());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            if (initialData.visitor?.id) setValue("visitorId", initialData.visitor.id);
            if (initialData.host?.id) setValue("hostId", initialData.host.id);
            if (initialData.scheduledCheckIn) {
                setValue("scheduledCheckIn", initialData.scheduledCheckIn);
                setDate(new Date(initialData.scheduledCheckIn));
            }
            setValue("isWalkIn", initialData.isWalkIn || false);
            if (initialData.purpose) setValue("purpose", initialData.purpose);
            if (initialData.status) setValue("status", initialData.status);
        }
    }, [initialData, setValue]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
        setValue("scheduledCheckIn", currentDate.toISOString());
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShowPicker(true);
        setMode(currentMode);
    };

    const submitHandler = (data: CreateVisitPayload) => {
        onSubmit(data);
    };

    const handleCreateVisitor = async (visitorData: Partial<Visitor>) => {
        try {
            const resultAction = await dispatch(createGuestThunk(visitorData));
            if (createGuestThunk.fulfilled.match(resultAction)) {
                const newVisitor = resultAction.payload;
                setValue("visitorId", newVisitor._id);
                setIsCreatingVisitor(false);
                setSelectingVisitor(false);
            }
        } catch (error) {
            console.error("Failed to create visitor", error);
        }
    };

    if (selectingVisitor) {
        return (
            <>
                <SelectionList
                    data={visitors}
                    onSelect={(visitor) => {
                        setValue("visitorId", visitor._id);
                        setSelectingVisitor(false);
                    }}
                    onClose={() => setSelectingVisitor(false)}
                    title="Select Visitor"
                    searchKeys={['name', 'email', 'companyNameFallback']}
                    onAddNew={() => setIsCreatingVisitor(true)}
                    renderItem={(visitor) => (
                        <>
                            <View className="h-10 w-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                                {visitor.profileImgUri ? (
                                    <Image source={{ uri: visitor.profileImgUri }} className="h-10 w-10 rounded-full" />
                                ) : (
                                    <User size={20} color="#4F46E5" />
                                )}
                            </View>
                            <View>
                                <Text className="font-medium text-gray-900">{visitor.name}</Text>
                                <Text className="text-xs text-gray-500">{visitor.companyNameFallback || visitor.email}</Text>
                            </View>
                        </>
                    )}
                />
                <Modal
                    visible={isCreatingVisitor}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setIsCreatingVisitor(false)}
                >
                    <VisitorForm
                        visible={isCreatingVisitor}
                        onClose={() => setIsCreatingVisitor(false)}
                        onSubmit={handleCreateVisitor}
                    />
                </Modal>
            </>
        );
    }

    if (selectingHost) {
        return (
            <SelectionList
                data={employees}
                onSelect={(employee) => {
                    setValue("hostId", employee._id);
                    setSelectingHost(false);
                }}
                onClose={() => setSelectingHost(false)}
                title="Select Host"
                searchKeys={['name', 'email', 'department', 'jobTitle']}
                renderItem={(employee) => (
                    <>
                        <View className="h-10 w-10 rounded-full bg-green-100 items-center justify-center mr-3">
                             {employee.profileImgUri ? (
                                <Image source={{ uri: employee.profileImgUri }} className="h-10 w-10 rounded-full" />
                            ) : (
                                <Briefcase size={20} color="#10B981" />
                            )}
                        </View>
                        <View>
                            <Text className="font-medium text-gray-900">{employee.name}</Text>
                            <Text className="text-xs text-gray-500">{employee.jobTitle} - {employee.department}</Text>
                        </View>
                    </>
                )}
            />
        );
    }

    return (
        <View className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl h-[600px]">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">
                    {isUpdating ? "Update Visit" : "Schedule Visit"}
                </Text>
                <TouchableOpacity onPress={onCancel}>
                    <X size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Visitor Selection */}
                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-sm font-medium text-gray-700">Visitor</Text>
                        {!isUpdating && (
                            <TouchableOpacity onPress={() => setIsCreatingVisitor(true)} className="flex-row items-center">
                                <Text className="text-primary text-xs font-bold mr-1">Add New</Text>
                                <User size={12} color="#4F46E5" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => !isUpdating && setSelectingVisitor(true)}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex-row justify-between items-center ${isUpdating ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={isUpdating}
                    >
                        {selectedVisitor ? (
                            <View className="flex-row items-center">
                                <Text className="font-medium text-gray-900">{selectedVisitor.name}</Text>
                            </View>
                        ) : (
                            <Text className="text-gray-400">Select Visitor</Text>
                        )}
                        {!isUpdating && <ChevronRight size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                    {errors.visitorId && <Text className="text-red-500 text-xs mt-1">{errors.visitorId.message}</Text>}
                </View>

                {/* Host Selection */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Host</Text>
                    <TouchableOpacity
                        onPress={() => !isUpdating && setSelectingHost(true)}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex-row justify-between items-center ${isUpdating ? 'bg-gray-50' : 'bg-white'}`}
                        disabled={isUpdating}
                    >
                        {selectedHost ? (
                            <View className="flex-row items-center">
                                <Text className="font-medium text-gray-900">{selectedHost.name}</Text>
                            </View>
                        ) : (
                            <Text className="text-gray-400">Select Host</Text>
                        )}
                        {!isUpdating && <ChevronRight size={20} color="#9CA3AF" />}
                    </TouchableOpacity>
                    {errors.hostId && <Text className="text-red-500 text-xs mt-1">{errors.hostId.message}</Text>}
                </View>

                {/* Topic / Purpose */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Topic of Visit</Text>
                    <Controller
                        control={control}
                        name="purpose"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g. Interview, Meeting, Delivery"
                            />
                        )}
                    />
                </View>

                {/* Status Selection - Only for Updates */}
                {isUpdating && (
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Status</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {STATUS_OPTIONS.map((statusOption) => (
                                <TouchableOpacity
                                    key={statusOption.value}
                                    onPress={() => setValue('status', statusOption.value as any)}
                                    className={`px-3 py-2 rounded-lg border ${
                                        currentStatus === statusOption.value 
                                            ? statusOption.color + ' border-2' 
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <Text className={`text-xs font-medium ${
                                        currentStatus === statusOption.value ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                        {statusOption.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Scheduled Check-in */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Scheduled Check-in</Text>
                    <View className="flex-row gap-x-3">
                        <TouchableOpacity
                            onPress={() => showMode('date')}
                            className="flex-1 flex-row items-center px-4 py-3 border border-gray-300 rounded-lg bg-white"
                        >
                            <Calendar size={20} color="#6B7280" className="mr-2" />
                            <Text className="text-gray-900">{format(date, "MMM dd, yyyy")}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => showMode('time')}
                            className="flex-1 flex-row items-center px-4 py-3 border border-gray-300 rounded-lg bg-white"
                        >
                            <Clock size={20} color="#6B7280" className="mr-2" />
                            <Text className="text-gray-900">{format(date, "hh:mm a")}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {showPicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={false}
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                    
                    {/* Hidden input to register the field for validation if needed, though we set value directly */}
                    <Controller
                        control={control}
                        name="scheduledCheckIn"
                        rules={{ required: "Date is required" }}
                        render={() => <View />} 
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

            {/* Visitor Creation Modal (Accessible from main view) */}
            <Modal
                visible={isCreatingVisitor}
                animationType="slide"
                transparent
                onRequestClose={() => setIsCreatingVisitor(false)}
            >
                <VisitorForm
                    visible={isCreatingVisitor}
                    onClose={() => setIsCreatingVisitor(false)}
                    onSubmit={handleCreateVisitor}
                />
            </Modal>
        </View>
    );
}
