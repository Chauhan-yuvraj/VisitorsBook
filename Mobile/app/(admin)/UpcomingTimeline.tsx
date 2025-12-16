import React from 'react';
import { View, Text } from 'react-native';
import { Visit } from '@/store/types/visit';
import { format } from 'date-fns';

interface UpcomingItemProps {
  name: string;
  detail: string;
  time: string;
  color?: string;
}

const UpcomingItem = ({ name, detail, time, color = 'bg-black' }: UpcomingItemProps) => (
  <View className="relative pl-6 pb-6 border-l border-gray-100 last:border-0">
    <View className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${color} ring-4 ring-white`} />
    <View className="flex-row justify-between items-start">
      <View>
        <Text className="font-semibold text-sm text-gray-900">{name}</Text>
        <Text className="text-xs text-gray-400">{detail}</Text>
      </View>
      <View className="bg-gray-50 px-2 py-1 rounded">
        <Text className="text-xs font-mono font-medium text-gray-500">{time}</Text>
      </View>
    </View>
  </View>
);

interface UpcomingTimelineProps {
  visits?: Visit[];
}

const UpcomingTimeline = ({ visits = [] }: UpcomingTimelineProps) => {
  // Filter for upcoming visits (e.g., status is SCHEDULED or PENDING)
  // For now, let's just take the first 3 scheduled visits
  const upcomingVisits = visits
    .filter(v => v.status === 'PENDING')
    .slice(0, 3);

  return (
    <View className="bg-surface rounded-3xl p-6 shadow-sm border border-gray-100">
       <View className="flex-row justify-between items-center mb-6">
          <Text className="font-bold text-gray-800">Upcoming</Text>
       </View>
       <View>
          {upcomingVisits.length > 0 ? (
            upcomingVisits.map((visit, index) => (
              <UpcomingItem 
                key={visit._id}
                name={visit.visitor?.name || "Unknown"} 
                detail={`${visit.purpose || 'Visit'} • ${visit.host?.name || 'Host'}`} 
                time={visit.scheduledCheckIn ? format(new Date(visit.scheduledCheckIn), 'HH:mm') : '--:--'}
                color={index === 0 ? 'bg-black' : 'bg-gray-300'}
              />
            ))
          ) : (
            <Text className="text-gray-400 text-sm">No upcoming visits scheduled.</Text>
          )}
       </View>
    </View>
  );
};

export default UpcomingTimeline;