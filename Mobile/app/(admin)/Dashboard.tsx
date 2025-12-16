import React from "react";
import { View, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Sidebar from "../../components/dashboard/sidebar/Sidebar";
import Background from "@/components/Background";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardTabs } from "@/hooks/Dashboard/useDashboardTabs";

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  const { currentTab, navigate } = useDashboardTabs("Dashboard");

  return (
    <Background>
      <View className="flex-1">
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        <View className="flex-1 flex-row h-full">
          {/* Sidebar */}
          <View
            style={{ paddingTop: insets.top }}
            className="bg-surface border-r border-gray-100 hidden md:flex h-full"
          >
            <Sidebar currentTab={currentTab} onNavigate={navigate} />
          </View>

          {/* Dynamic content */}
          <View className="flex-1">
            <DashboardContent tab={currentTab} navigate={navigate} />
          </View>
        </View>
      </View>
    </Background>
  );
}
