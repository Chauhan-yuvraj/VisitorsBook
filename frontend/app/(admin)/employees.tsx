import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchEmployeesThunk } from '@/store/slices/employees.slice';
import Background from '@/components/Background';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmployeesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector((state: RootState) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  if (loading && employees.length === 0) {
    return (
      <Background>
        <ActivityIndicator size="large" color="#fff" className="flex-1" />
      </Background>
    );
  }

  return (
    <Background>
      <SafeAreaView className="flex-1 p-4">
        {error ? <Text className="text-red-500 text-center mb-4">{error}</Text> : null}
        
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-xl mb-4 flex-row items-center shadow-sm">
              <Image 
                source={{ uri: item.profileImgUri || 'https://via.placeholder.com/100' }} 
                className="w-12 h-12 rounded-full bg-gray-200 mr-4"
              />
              <View>
                <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                <Text className="text-gray-600">{item.jobTitle}</Text>
                <Text className="text-gray-500 text-xs">{item.email}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-white text-center mt-10">No employees found.</Text>
          }
        />
      </SafeAreaView>
    </Background>
  );
}
