import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVisits } from "@/store/slices/visitSlice";
import { fetchDeliveries } from "@/store/slices/deliverySlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import { fetchVisitors } from "@/store/slices/visitorSlice";
import {
  Users,
  Package,
  CalendarCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { visits } = useAppSelector((state) => state.visits);
  const { deliveries } = useAppSelector((state) => state.deliveries);
  const { employees } = useAppSelector((state) => state.employees);
  const { visitors } = useAppSelector((state) => state.visitors);

  useEffect(() => {
    dispatch(fetchVisits({}));
    dispatch(fetchDeliveries());
    dispatch(fetchEmployees());
    dispatch(fetchVisitors());
  }, [dispatch]);

  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const visitsToday = visits.filter((v) =>
      v.scheduledCheckIn.startsWith(todayStr)
    ).length;

    const activeVisits = visits.filter(
      (v) => v.status === "CHECKED_IN"
    ).length;

    const pendingDeliveries = deliveries.filter(
      (d) => d.status === "PENDING"
    ).length;

    return {
      visitsToday,
      activeVisits,
      pendingDeliveries,
      totalEmployees: employees.length,
      totalVisitors: visitors.length,
    };
  }, [visits, deliveries, employees, visitors]);

  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return last7Days.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const count = visits.filter((v) =>
        v.scheduledCheckIn.startsWith(dateStr)
      ).length;
      return {
        name: days[date.getDay()],
        visits: count,
      };
    });
  }, [visits]);

  const recentActivity = useMemo(() => {
    const visitActivities = visits.map((v) => ({
      type: "visit",
      id: v._id,
      title: `${v.visitor.name} - ${v.purpose}`,
      time: v.updatedAt || v.createdAt,
      status: v.status,
    }));

    const deliveryActivities = deliveries.map((d) => ({
      type: "delivery",
      id: d._id,
      title: `Delivery for ${d.recipientId?.name || "Unknown"}`,
      time: d.updatedAt || d.createdAt,
      status: d.status,
    }));

    return [...visitActivities, ...deliveryActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }, [visits, deliveries]);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Weekly Visits Overview</h3>
            <select className="text-sm border rounded-md px-2 py-1 bg-background">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#888888", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="visits"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      activity.type === "visit"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground capitalize">
                        {activity.status.toLowerCase().replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            )}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-xs" asChild>
            <Link to="/dashboard/visits">View All Activity</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp,
  alert,
}: StatsCardProps) {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className={`h-4 w-4 ${alert ? "text-red-500" : "text-muted-foreground"}`} />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium flex items-center ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {trend}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}

export default Dashboard;
