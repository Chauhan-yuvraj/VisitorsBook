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
import type { RootState } from "@/store/store";

const SlotStatusCard: React.FC<{ selectedSlot?: TimeSlot }> = ({
  selectedSlot,
}) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6 w-full min-h-50">
      <h3 className="font-semibold text-base sm:text-lg mb-4">Slot Status</h3>

      {!selectedSlot ? (
        <p className="text-muted-foreground text-sm">
          Select a time slot to view details
        </p>
      ) : (
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            {selectedSlot.time}
          </div>

          {selectedSlot.available ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">Available</span>
            </div>
          ) : selectedSlot.booked ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Booked</span>
              </div>
              {selectedSlot.reason && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Reason:
                  </span>
                  <p className="text-sm mt-1">{selectedSlot.reason}</p>
                </div>
              )}
              {selectedSlot.person && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    With:
                  </span>
                  <p className="text-sm mt-1">{selectedSlot.person}</p>
                </div>
              )}
              {selectedSlot.type === "meeting" && selectedSlot.meetingLink && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Meeting Link:
                  </span>
                  <a
                    href={selectedSlot.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all block mt-1"
                  >
                    {selectedSlot.meetingLink}
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">Unavailable</span>
              </div>
              {selectedSlot.reason && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Reason:
                  </span>
                  <p className="text-sm mt-1">{selectedSlot.reason}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { stats, chartData, recentActivity } = useDashboardData();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState<string | undefined>();
  const [availabilityData, setAvailabilityData] = React.useState<any[]>([]);
  const [slotsData, setSlotsData] = React.useState<TimeSlot[]>([]);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

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
        onClose={() => setIsMeetingModalOpen(false)}
      />
    </div>
  );
};
export default Dashboard;
