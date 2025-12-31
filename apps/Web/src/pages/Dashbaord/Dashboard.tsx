import { Link } from "react-router-dom";
import { Users, Package, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { VisitsChart } from "@/components/Dashboard/VisitsChart";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { useDashboardData } from "@/hooks/Dashboard/useDashboardData";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlots, type TimeSlot } from "@/components/ui/TimeSlots";
import MeetingModal from "@/components/Meeting/MeetingModal";
import React from "react";
import { useSelector } from "react-redux";
import { availabilityService } from "@/services/availability.service";
import { useMeetings } from "@/hooks/useMeetings";
import type { RootState } from "@/store/store";

const SlotStatusCard: React.FC<{ selectedSlot?: TimeSlot }> = ({
  selectedSlot,
}) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 w-full min-h-50">
      <h3 className="font-semibold text-base sm:text-lg mb-4">Slot Status</h3>

      {!selectedSlot ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm mb-2">
            Select a time slot to view details
          </p>
          <p className="text-xs text-muted-foreground">
            Click on any time slot to see its current status and details
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Time Header */}
          <div className="text-center pb-3 border-b">
            <div className="text-lg font-semibold text-foreground">
              {selectedSlot.time}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Click any slot to view its details
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-3 py-2">
            {selectedSlot.available ? (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-semibold text-lg">Available</span>
              </>
            ) : selectedSlot.booked ? (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-semibold text-lg">Booked</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600 font-semibold text-lg">Unavailable</span>
              </>
            )}
          </div>

          {/* Detailed Information */}
          <div className="space-y-3 text-sm">
            {selectedSlot.booked && (
              <>
                {selectedSlot.reason && (
                  <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="font-medium text-red-800 dark:text-red-200">
                      Meeting:
                    </span>
                    <p className="text-red-700 dark:text-red-300 mt-1 font-medium">
                      {selectedSlot.reason}
                    </p>
                  </div>
                )}
                {selectedSlot.person && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Host/Organizer:
                    </span>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                      {selectedSlot.person}
                    </p>
                  </div>
                )}
                {selectedSlot.type === "meeting" && selectedSlot.meetingLink && (
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      Meeting Link:
                    </span>
                    <a
                      href={selectedSlot.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:underline break-all block mt-1 text-xs"
                    >
                      {selectedSlot.meetingLink}
                    </a>
                  </div>
                )}
              </>
            )}

            {!selectedSlot.available && !selectedSlot.booked && selectedSlot.reason && (
              <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Reason:
                </span>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {selectedSlot.reason}
                </p>
              </div>
            )}

            {selectedSlot.available && (
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                <span className="text-green-800 dark:text-green-200 font-medium">
                  This time slot is available for scheduling
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState<string | undefined>();
  const [availabilityData, setAvailabilityData] = React.useState<any[]>([]);
  const [slotsData, setSlotsData] = React.useState<TimeSlot[]>([]);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats, chartData, recentActivity } = useDashboardData();
  
  // Fetch meetings for the user
  const { meetings, fetchMeetings } = useMeetings(user?._id);

  // Load meetings when user changes
  React.useEffect(() => {
    if (user?._id) {
      fetchMeetings(user._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Load availability when date changes
  React.useEffect(() => {
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
      const currentAvailabilityMap = new Map();
      availabilityData.forEach((avail: any) => {
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
          slotsToDelete.push(availability._id);
        }
      });

      // Delete the slots that are now available
      for (const availabilityId of slotsToDelete) {
        await availabilityService.deleteAvailability(availabilityId);
      }

      // Convert remaining unavailable slots to AvailabilitySlot format
      const availabilitySlots = updatedSlots
        .filter((slot) => !slot.available && !slot.booked) // Only save unavailable slots
        .map((slot) => {
          // Parse time string to create Date objects
          const timeMatch = slot.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (!timeMatch) return null;

          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3].toUpperCase();

          if (ampm === "PM" && hours !== 12) hours += 12;
          if (ampm === "AM" && hours === 12) hours = 0;

          const startTime = new Date(date);
          startTime.setHours(hours, minutes, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 30);

          return {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            status: "UNAVAILABLE" as const,
            reason: slot.reason || "",
          };
        })
        .filter(Boolean) as any[];

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

  // Handle meeting modal close and refresh data
  const handleMeetingModalClose = async () => {
    setIsMeetingModalOpen(false);
    // Small delay to ensure backend has processed the meeting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Refresh meetings and availability after meeting creation
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
        console.error("Failed to refresh data after meeting creation:", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of today's activities and statistics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard/visits">Schedule Visit</Link>
          </Button>
          <Button variant="outline" onClick={() => setIsMeetingModalOpen(true)}>
            Schedule Meeting
          </Button>
          <Button asChild>
            <Link to="/dashboard/deliveries">Record Delivery</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Visits Today"
          value={stats.visitsToday}
          icon={CalendarCheck}
          trend="+12% from yesterday"
          trendUp={true}
        />
        <StatsCard
          title="Active Visits"
          value={stats.activeVisits}
          icon={Users}
          description="Currently on premises"
        />
        <StatsCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Package}
          description="Waiting for collection"
          alert={stats.pendingDeliveries > 0}
        />
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          description="Registered in system"
        />
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={Users}
          description="Registered in system"
        />
      </div>

      {/* // Calendar and Time Slots - side by side */}

      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Schedule Management
          </h2>
          <p className="text-muted-foreground">
            Select a date and manage available time slots
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6">
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-sm mx-auto lg:mx-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm bg-card p-3 w-full"
                captionLayout="dropdown"
              />
            </div>
          </div>

          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full">
              <TimeSlots
                selectedDate={date}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot}
                editMode={true}
                onSlotsUpdate={handleSlotsUpdate}
                onSlotsChange={handleSlotsData}
                availabilityData={availabilityData}
                meetingsData={meetings}
              />
            </div>
          </div>

          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-sm mx-auto lg:mx-0">
              <SlotStatusCard selectedSlot={getSelectedSlotDetails()} />
            </div>
          </div>
        </div>
      </div>

      {/* Visits Chart - spans 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <VisitsChart data={chartData} />
        </div>

        {/* Recent Activity - takes 1 column on large screens */}
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={handleMeetingModalClose}
      />
    </div>
  );
};
export default Dashboard;
