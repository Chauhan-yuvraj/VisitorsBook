import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from "react-native";
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Camera,
  Image as ImageIcon,
} from "lucide-react-native";
import { Visitor } from "@/store/types/visitor";
import { useImagePicker } from "@/hooks/useImagePicker";
import { Image } from "react-native";

interface VisitorFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Visitor>) => void;
  initialData?: Visitor | null;
  isSubmitting?: boolean;
}

export default function VisitorForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: VisitorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyNameFallback: "",
    notes: "",
    isVip: false,
    isBlocked: false,
    profileImgUri: null as string | null,
  });

  const { handleTakePhoto, handleChooseFromGallery } = useImagePicker((uri) => {
    setFormData((prev) => ({ ...prev, profileImgUri: uri }));
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        companyNameFallback: initialData.companyNameFallback || "",
        notes: initialData.notes || "",
        isVip: initialData.isVip ?? false,
        isBlocked: initialData.isBlocked ?? false,
        profileImgUri: initialData.profileImgUri || null,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyNameFallback: "",
        notes: "",
        isVip: false,
        isBlocked: false,
        profileImgUri: null,
      });
    }
  }, [initialData, visible]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (!formData.name) {
      Alert.alert("Error", "Please fill in the required field (Name).");
      return;
    }
    onSubmit(formData);
  };

  const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon: Icon,
    keyboardType = "default" as any,
    multiline = false,
  }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {label}
      </Text>
      <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:border-primary focus:bg-white transition-colors">
        {Icon && <Icon size={20} color="#9CA3AF" className="mr-3" />}
        <TextInput
          className="flex-1 text-gray-900 text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          multiline={multiline}
          style={multiline ? { height: 80, textAlignVertical: 'top' } : {}}
        />
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-white rounded-t-3xl h-[85%] w-full shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Visitor" : "Add New Visitor"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
            
            {/* Image Picker Section */}
            <View className="mb-6 items-center">
              <View className="relative">
                <View className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 items-center justify-center">
                  {formData.profileImgUri ? (
                    <Image
                      source={{ uri: formData.profileImgUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <User size={40} color="#9CA3AF" />
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleChooseFromGallery}
                  className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white shadow-sm"
                >
                  <ImageIcon size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleTakePhoto}
                  className="absolute bottom-0 -left-2 bg-primary p-2 rounded-full border-2 border-white shadow-sm"
                >
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 mt-2">Tap icons to change photo</Text>
            </View>

            <FormInput
              label="Full Name *"
              value={formData.name}
              onChangeText={(text: string) => setFormData({ ...formData, name: text })}
              placeholder="e.g. John Doe"
              icon={User}
            />

            <FormInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text: string) => setFormData({ ...formData, email: text })}
              placeholder="john@example.com"
              icon={Mail}
              keyboardType="email-address"
            />

            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
              placeholder="+1 234 567 890"
              icon={Phone}
              keyboardType="phone-pad"
            />

            <FormInput
              label="Company / Organization"
              value={formData.companyNameFallback}
              onChangeText={(text: string) => setFormData({ ...formData, companyNameFallback: text })}
              placeholder="e.g. Acme Corp"
              icon={Building}
            />

            <FormInput
              label="Notes"
              value={formData.notes}
              onChangeText={(text: string) => setFormData({ ...formData, notes: text })}
              placeholder="Additional notes..."
              icon={FileText}
              multiline
            />

            {/* Toggles */}
            <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 mr-2">
                    <Text className="text-base font-medium text-gray-700">VIP Status</Text>
                    <Switch
                        value={formData.isVip}
                        onValueChange={(val) => setFormData({ ...formData, isVip: val })}
                        trackColor={{ false: "#E5E7EB", true: "#FCD34D" }}
                        thumbColor={formData.isVip ? "#B45309" : "#f4f3f4"}
                    />
                </View>
                <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 ml-2">
                    <Text className="text-base font-medium text-gray-700">Blocked</Text>
                    <Switch
                        value={formData.isBlocked}
                        onValueChange={(val) => setFormData({ ...formData, isBlocked: val })}
                        trackColor={{ false: "#E5E7EB", true: "#FCA5A5" }}
                        thumbColor={formData.isBlocked ? "#EF4444" : "#f4f3f4"}
                    />
                </View>
            </View>

            <View className="h-20" />
          </ScrollView>

          {/* Footer */}
          <View className="px-6 py-4 border-t border-gray-100 bg-white pb-8">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`flex-row items-center justify-center py-4 rounded-xl shadow-sm ${
                isSubmitting ? "bg-primary/70" : "bg-primary"
              }`}
            >
              {isSubmitting ? (
                <Text className="text-white font-bold text-lg">Saving...</Text>
              ) : (
                <>
                  <Save size={20} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-lg">
                    {initialData ? "Update Visitor" : "Create Visitor"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
