import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { availabilityService, type AvailabilitySlot } from "@/services/availability.service";
import { useMeetings } from "@/hooks/useMeetings";
import type { TimeSlot } from "@/components/ui/TimeSlots";

interface AvailabilityItem {
  _id: string;
  startTime: string;
  endTime: string;
  status: "UNAVAILABLE" | "OUT_OF_OFFICE" | "EMERGENCY";
  reason?: string;
}

export const useAvailability = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
  const [availabilityData, setAvailabilityData] = useState<AvailabilityItem[]>([]);
  const [slotsData, setSlotsData] = useState<TimeSlot[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const { meetings, fetchMeetings } = useMeetings(user?._id);

  // Load meetings when user changes
  useEffect(() => {
    if (user?._id) {
      fetchMeetings(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Load availability when date changes
  useEffect(() => {
    const loadAvailability = async () => {
      console.log("Checking date and user id : ", date, user?._id);
      if (!date || !user?._id) return;

      try {
        console.log("making api call from dashboard");
        const dateString = date.toISOString().split("T")[0];
        const response = await availabilityService.getAvailability(
          user._id,
          dateString
        );
        console.log("response :", response);
        if (response.success && response.data) {
          setAvailabilityData(response.data);
        } else {
          setAvailabilityData([]);
        }
      } catch (error) {
        console.error("Failed to load availability:", error);
        alert("Failed to load availability data");
      }
    };

    loadAvailability();
  }, [date, user?._id]);

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot.time);
  };

  const handleSlotsUpdate = async (updatedSlots: TimeSlot[]) => {
    if (!user?._id || !date) return;

    try {
      // Create a map of current availability data for quick lookup
      const currentAvailabilityMap = new Map<string, AvailabilityItem>();
      availabilityData.forEach((avail: AvailabilityItem) => {
        const startTime = new Date(avail.startTime);
        const timeString = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        currentAvailabilityMap.set(timeString, avail);
      });

      // Find slots that were previously unavailable but are now available (need to delete)
      const slotsToDelete: string[] = [];
      updatedSlots.forEach((slot) => {
        if (slot.available && currentAvailabilityMap.has(slot.time)) {
          // This slot was unavailable before but is now available
          const availability = currentAvailabilityMap.get(slot.time);
          if (availability) {
            slotsToDelete.push(availability._id);
          }
        }
      });

      // Delete the slots that are now available
      for (const availabilityId of slotsToDelete) {
        await availabilityService.deleteAvailability(availabilityId);
      }

      // Convert remaining unavailable slots to AvailabilitySlot format
      const availabilitySlots: AvailabilitySlot[] = [];
      updatedSlots
        .filter((slot) => !slot.available && !slot.booked) // Only save unavailable slots
        .forEach((slot) => {
          // Parse time string to create Date objects
          const timeMatch = slot.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (!timeMatch) return;

          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3].toUpperCase();

          if (ampm === "PM" && hours !== 12) hours += 12;
          if (ampm === "AM" && hours === 12) hours = 0;

          const startTime = new Date(date);
          startTime.setHours(hours, minutes, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30);

          availabilitySlots.push({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: "UNAVAILABLE",
            reason: slot.reason || "",
          });
        });

      // Update/create the remaining unavailable slots
      if (availabilitySlots.length > 0) {
        await availabilityService.updateAvailability(
          user._id,
          availabilitySlots
        );
      }

      // Refresh availability data after updates
      const dateString = date.toISOString().split("T")[0];
      const response = await availabilityService.getAvailability(
        user._id,
        dateString
      );
      if (response.success && response.data) {
        setAvailabilityData(response.data);
      } else {
        setAvailabilityData([]);
      }

      alert("Availability updated successfully");
    } catch (error) {
      console.error("Failed to update availability:", error);
      alert("Failed to update availability");
    }
  };

  const handleSlotsData = (slots: TimeSlot[]) => {
    setSlotsData(slots);
  };

  const getSelectedSlotDetails = (): TimeSlot | undefined => {
    return slotsData.find((slot) => slot.time === selectedSlot);
  };

  const refreshData = async () => {
    if (user?._id) {
      try {
        // Refresh meetings
        await fetchMeetings(user._id);

        // Refresh availability for current date
        if (date) {
          const dateString = date.toISOString().split("T")[0];
          const response = await availabilityService.getAvailability(user._id, dateString);
          if (response.success && response.data) {
            setAvailabilityData(response.data);
          } else {
            setAvailabilityData([]);
          }
        }
      } catch (error) {
        console.error("Failed to refresh data:", error);
      }
    }
  };

  return {
    date,
    setDate,
    selectedSlot,
    availabilityData,
    slotsData,
    meetings,
    handleSlotSelect,
    handleSlotsUpdate,
    handleSlotsData,
    getSelectedSlotDetails,
    refreshData,
  };
};