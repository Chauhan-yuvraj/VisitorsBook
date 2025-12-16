import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  LayoutGrid,
  Users,
  Send,
  PieChart,
  LogOut,
  UserRoundPen,
  Package,
  FileText,
} from "lucide-react-native";

// Define the available tabs to avoid typos
export type TabName =
  | "Dashboard"
  | "Employees"
  | "Visitors"
  | "Visits"
  | "Records"
  | "userForm"
  | "Analytics"
  | "Deliveries";

interface SidebarItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  active?: boolean;
  onPress: () => void; // Added onPress prop
}

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onPress,
}: SidebarItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-4 py-3 rounded-xl mb-1 ${
      active ? "bg-gray-50" : "hover:bg-gray-50"
    }`}
  >
    <Icon size={20} color={active ? "#111827" : "#9CA3AF"} />
    <Text
      className={`ml-3 font-medium text-sm ${
        active ? "text-primary" : "text-gray-400"
      }`}
    >
      {label}
    </Text>
    {active && (
      <View className="absolute left-0 h-6 w-1 bg-primary rounded-r-full" />
    )}
  </TouchableOpacity>
);

interface SidebarProps {
  currentTab: TabName;
  onNavigate: (tab: TabName) => void;
}

const Sidebar = ({ currentTab, onNavigate }: SidebarProps) => {
  return (
    <View className="w-64 bg-surface border-r border-gray-100 flex-col justify-between pt-8 pb-8 hidden md:flex h-full">
      <View>
        {/* Logo */}
        <View className="flex items-center px-8 mb-8">
          <View className="rounded-lg p-1 items-center justify-center mr-3">
            <Image
              source={require("@/assets/images/icon.png")}
              className="h-16 w-16"
            />
          </View>
          <Text className="font-bold text-xl text-primary">
            Abhyuday<Text className="text-orange-400"> Bharat</Text>
          </Text>
        </View>

        {/* Nav */}
        <View className="px-4">
          <SidebarItem
            icon={LayoutGrid}
            label="Dashboard"
            active={currentTab === "Dashboard"}
            onPress={() => onNavigate("Dashboard")}
          />
          <SidebarItem
            icon={UserRoundPen}
            label="Employees"
            active={currentTab === "Employees"}
            onPress={() => onNavigate("Employees")}
          />
          <SidebarItem
            icon={Users}
            label="Visitors"
            active={currentTab === "Visitors"}
            onPress={() => onNavigate("Visitors")}
          />
          <SidebarItem
            icon={Send}
            label="Visits"
            active={currentTab === "Visits"}
            onPress={() => onNavigate("Visits")}
          />
          <SidebarItem
            icon={FileText}
            label="Records"
            active={currentTab === "Records"}
            onPress={() => onNavigate("Records")}
          />
          <SidebarItem
            icon={Package}
            label="Deliveries"
            active={currentTab === "Deliveries"}
            onPress={() => onNavigate("Deliveries")}
          />
        </View>
      </View>

      {/* Footer */}
      <View className="px-4">
        {/* Logic for Logout usually doesn't change tabs, but calls an auth function */}
        <SidebarItem
          icon={LogOut}
          label="Log Out"
          onPress={() => console.log("Logout")}
        />
      </View>
    </View>
  );
};

export default Sidebar;
