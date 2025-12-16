import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Package } from "lucide-react-native";
import { format, isToday } from "date-fns";

import StatCard from "@/app/(admin)/StatsCard";
import VisitorRow from "@/app/(admin)/VisitorRow";
import UpcomingTimeline from "@/app/(admin)/UpcomingTimeline";
import VisitForm from "./Visits/VisitForm";
import DeliveryForm from "./Deliveries/DeliveryForm";

import { useVisitActions } from "@/hooks/Dashboard/visits/useVisitActions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVisitsThunk } from "@/store/slices/visit.slice";
import { fetchDeliveriesThunk } from "@/store/slices/delivery.slice";
import { useRefresh } from "@/hooks/useRefresh";

export default function MainDashBoard() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [isCheckInVisible, setIsCheckInVisible] = useState(false);
  const [isDeliveryVisible, setIsDeliveryVisible] = useState(false);

  const { handleCreate } = useVisitActions(() => setIsCheckInVisible(false));

  const { visits } = useAppSelector((state) => state.visits);
  const { deliveries } = useAppSelector((state) => state.delivery);

  // Fetch visits and deliveries on mount
  const loadData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchVisitsThunk({})),
      dispatch(fetchDeliveriesThunk()),
    ]);
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { refreshing, onRefresh } = useRefresh(loadData);

  const dashboardStats = useMemo(() => {
    const checkedIn = visits.filter((v) => v.status === "CHECKED_IN").length;

    const expected = visits.filter(
      (v) =>
        v.status === "PENDING" &&
        v.scheduledCheckIn &&
        isToday(new Date(v.scheduledCheckIn))
    ).length;

    const packages = deliveries.filter((d) => d.status === "PENDING").length;

    const recent = [...visits]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);

    return {
      checkedInCount: checkedIn,
      expectedCount: expected,
      pendingPackagesCount: packages,
      recentVisits: recent,
    };
  }, [visits, deliveries]);

  const { checkedInCount, expectedCount, pendingPackagesCount, recentVisits } =
    dashboardStats;

  return (
    <View className="flex-1">
      {/* Header */}
      {/* 4. Add paddingTop equal to insets.top here */}
      <View style={{ paddingTop: insets.top }} className="flex-col z-10">
        <View className="h-20 flex-row items-center justify-between px-6">
          <View>
            <Text className="text-2xl font-bold text-primary">
              Good Morning, Admin
            </Text>
            <Text className="text-xs text-gray-400 font-medium">
              {format(new Date(), "EEEE, MMM dd")}
            </Text>
          </View>
        </View>
      </View>

      {/* Scrollable Dashboard Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} // Add bottom padding for scroll
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 1. Stats Grid */}
        <View className="flex-row flex-wrap -mx-1 mb-6 mt-6">
          <StatCard
            label="Checked In"
            value={checkedInCount.toString()}
            subLabel="visitors"
          />
          <StatCard
            label="Expected"
            value={expectedCount.toString()}
            subLabel="scheduled"
          />
          <StatCard
            label="Packages"
            value={pendingPackagesCount.toString()}
            subLabel="pending"
            isAlert={pendingPackagesCount > 0}
          />

          {/* Add Button Tile */}
          <TouchableOpacity
            onPress={() => setIsCheckInVisible(true)}
            className="bg-primary p-5 rounded-3xl mb-4 shadow-lg flex-1 min-w-[150px] mx-1 items-center justify-center"
          >
            <View className="bg-white/20 p-2 rounded-full mb-2">
              <Plus color="white" size={20} />
            </View>
            <Text className="text-white font-medium">New Check-In</Text>
          </TouchableOpacity>

          {/* Delivery Button Tile */}
          <TouchableOpacity
            onPress={() => setIsDeliveryVisible(true)}
            className="bg-orange-500 p-5 rounded-3xl mb-4 shadow-lg flex-1 min-w-[150px] mx-1 items-center justify-center"
          >
            <View className="bg-white/20 p-2 rounded-full mb-2">
              <Package color="white" size={20} />
            </View>
            <Text className="text-white font-medium">Log Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Main Content Split */}
        <View className="flex-col lg:flex-row gap-6 pb-10">
          {/* Left: Recent Activity Table */}
          <View className="flex-[2] bg-surface rounded-3xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-4 border-b border-gray-50 pb-4">
              <Text className="font-bold text-lg text-primary">
                Recent Activity
              </Text>
              <Text className="text-sm text-gray-400">View All</Text>
            </View>

            <View>
              {recentVisits.length > 0 ? (
                recentVisits.map((visit) => (
                  <VisitorRow
                    key={visit._id}
                    name={visit.visitor?.name || "Unknown"}
                    company={visit.visitor?.company || "N/A"}
                    host={visit.host?.name || "N/A"}
                    time={
                      visit.actualCheckIn
                        ? format(new Date(visit.actualCheckIn), "hh:mm a")
                        : "--:--"
                    }
                    status={
                      visit.status === "CHECKED_IN"
                        ? "Active"
                        : visit.status === "CHECKED_OUT"
                        ? "Departed"
                        : "Pending"
                    }
                    image={visit.visitor?.profileImgUri}
                  />
                ))
              ) : (
                <Text className="text-gray-400 text-center py-4">
                  No recent activity
                </Text>
              )}
            </View>
          </View>

          {/* Right: Timeline & Widget */}
          <View className="flex-1 gap-6">
            <UpcomingTimeline visits={visits} />

            {/* <View className="bg-indigo-600 rounded-3xl p-6 shadow-lg overflow-hidden relative">
              <View className="absolute -top-10 -right-10 h-32 w-32 bg-white opacity-10 rounded-full" />

              <Text className="text-indigo-100 text-xs font-medium mb-1">
                Peak Traffic
              </Text>
              <View className="flex-row items-end gap-1 mb-2">
                <Text className="text-3xl font-bold text-white">02:00</Text>
                <Text className="text-sm text-indigo-200 mb-1">PM</Text>
              </View>
              <Text className="text-xs text-indigo-200 leading-5">
                Expect a surge in visitors after lunch based on historical data.
              </Text>
            </View> */}
          </View>
        </View>
      </ScrollView>

      <Modal visible={isCheckInVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <VisitForm
            onCancel={() => setIsCheckInVisible(false)}
            onSubmit={async (data) => {
              await handleCreate(data);
              setIsCheckInVisible(false);
            }}
            initialData={{ isWalkIn: true } as any}
          />
        </View>
      </Modal>

      <DeliveryForm
        visible={isDeliveryVisible}
        onClose={() => setIsDeliveryVisible(false)}
      />
    </View>
  );
}
