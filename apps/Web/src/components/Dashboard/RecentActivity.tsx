import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

interface ActivityItem {
  type: string;
  id: string;
  title: string;
  time: string | Date;
  status: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6">
      <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Recent Activity</h3>
      <div className="space-y-3 sm:space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start gap-3 pb-3 sm:pb-4 border-b last:border-0 last:pb-0"
            >
              <div
                className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  activity.type === "visit" ? "bg-blue-500" : "bg-orange-500"
                }`}
              />
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-sm font-medium leading-tight wrap-break-word">
                  {activity.title}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
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
          <p className="text-sm text-muted-foreground text-center py-6 sm:py-8">
            No recent activity
          </p>
        )}
      </div>
      <Button variant="ghost" className="w-full mt-3 sm:mt-4 text-xs" asChild>
        <Link to="/dashboard/visits">View All Activity</Link>
      </Button>
    </div>
  );
};
