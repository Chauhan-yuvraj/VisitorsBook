import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constants/dashboard/navigation";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export function Sidebar() {
  const { role } = useAppSelector((state) => state.auth);
  useEffect(() => {
    console.log("User role in Sidebar:", role);
  }, [role]);
  return (
    <div className="w-64 bg-background border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex flex-col items-center gap-2">
        {/* Placeholder for Logo */}
        <div className="">
          <img src="/icon.png" alt="Logo" className="w-16" />
        </div>
        <span className="font-bold text-xl">Abhyuday Bharat</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems
          .filter(
            (item) =>
              role &&
              (role === "all" ||
                (item.roles as readonly string[]).includes(role))
          )
          .map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
