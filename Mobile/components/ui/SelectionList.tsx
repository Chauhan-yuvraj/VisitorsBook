import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { X, Search } from "lucide-react-native";

interface SelectionListProps<T> {
    data: T[];
    onSelect: (item: T) => void;
    onClose: () => void;
    title: string;
    renderItem: (item: T) => React.ReactNode;
    searchKeys: (keyof T)[];
    onAddNew?: () => void;
}

export function SelectionList<T>({ data, onSelect, onClose, title, renderItem, searchKeys, onAddNew }: SelectionListProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter(item => 
        searchKeys.some(key => {
            const value = item[key];
            return typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase());
        })
    );

    return (
        <View className="h-[80vh] w-[80vw] bg-white rounded-2xl p-8">
            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-xl font-bold text-gray-900">{title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <X size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>
            
            <View className="bg-gray-100 rounded-xl flex-row items-center px-3 py-2 mb-4">
                <Search size={20} color="#9CA3AF" />
                <TextInput 
                    className="flex-1 ml-2 text-base"
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={(item: any) => item._id || item.id || Math.random().toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => {
                            onSelect(item);
                            setSearchQuery("");
                        }}
                        className="p-3 border-b border-gray-100 flex-row items-center"
                    >
                        {renderItem(item)}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text className="text-center text-gray-500 mt-4">No results found</Text>}
            />
        </View>
    );
}
