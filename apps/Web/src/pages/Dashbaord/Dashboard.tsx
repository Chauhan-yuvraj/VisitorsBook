import { Link } from "react-router-dom";
import { Users, Package, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { VisitsChart } from "@/components/Dashboard/VisitsChart";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import SlotStatusCard from "@/components/Dashboard/SlotStatusCard";
import { useDashboardData } from "@/hooks/Dashboard/useDashboardData";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlots } from "@/components/ui/TimeSlots";
import MeetingModal from "@/components/Meeting/MeetingModal";
import { useAvailability } from "@/hooks/Dashboard/useAvailability";
import { useMeetingModal } from "@/hooks/Dashboard/useMeetingModal";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const Dashboard: React.FC = () => {
  const { stats, chartData, recentActivity } = useDashboardData();
  const {
    date,
    setDate,
    selectedSlot,
    availabilityData,
    meetings,
    handleSlotSelect,
    handleSlotsUpdate,
    handleSlotsData,
    getSelectedSlotDetails,
    refreshData,
  } = useAvailability();

  const {
    isOpen: isMeetingModalOpen,
    openModal: openMeetingModal,
    closeModal: closeMeetingModal,
  } = useMeetingModal(refreshData);

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
          <PermissionGuard permission="create_visits">
            <Button asChild variant="outline">
              <Link to="/dashboard/visits">Schedule Visit</Link>
            </Button>
          </PermissionGuard>

          <PermissionGuard permission="create_meetings">
            <Button variant="outline" onClick={openMeetingModal}>
              Schedule Meeting
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={["view_all_deliveries", "manage_deliveries"]}>
            <Button asChild>
              <Link to="/dashboard/deliveries">Record Delivery</Link>
            </Button>
          </PermissionGuard>
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

      {/* Schedule Management */}
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

      {/* Visits Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <VisitsChart data={chartData} />
        </div>
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Meeting Modal */}
      <MeetingModal isOpen={isMeetingModalOpen} onClose={closeMeetingModal} />
    </div>
  );
};

export default Dashboard;
