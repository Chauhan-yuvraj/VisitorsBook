// src/constants/navigation.ts
import {
  LayoutGrid,
  Users,
  Send,
  UserRoundPen,
  Package,
  FileText,
  Building2,
} from "lucide-react";
import { UserRole } from "@/types/user";
import type { LucideIcon } from "lucide-react";

// Enforce a consistent, widened role type across all items
type SidebarItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  roles: UserRole[];
};

export const sidebarItems: SidebarItem[] = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE, UserRole.EMPLOYEE] },
  { icon: UserRoundPen, label: "Employees", href: "/dashboard/employees", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE, UserRole.EMPLOYEE] },
  { icon: Users, label: "Visitors", href: "/dashboard/visitors", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE] },
  { icon: Send, label: "Visits", href: "/dashboard/visits", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE, UserRole.EMPLOYEE] },
  { icon: FileText, label: "Records", href: "/dashboard/records", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE, UserRole.EMPLOYEE] },
  { icon: Package, label: "Deliveries", href: "/dashboard/deliveries", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE, UserRole.EMPLOYEE] },
  { icon: Building2, label: "Departments", href: "/dashboard/departments", roles: [UserRole.ADMIN, UserRole.HR, UserRole.EXECUTIVE, UserRole.EMPLOYEE] },
] as const;
