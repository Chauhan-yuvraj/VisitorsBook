export enum UserRole {
  EMPLOYEE = 'employee',
  HR = 'hr',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    'manage_departments',
    'manage_employees',
    'view_all_meetings',
    'create_meetings',
    'edit_all_meetings',
    'view_all_visits',
    'create_visits',
    'view_all_visitors',
    'create_visitors',
    'view_all_deliveries',
    'create_deliveries',
    'manage_projects',
    'manage_records'
  ],
  [UserRole.HR]: [
    'manage_departments',
    'manage_employees',
    'view_all_meetings',
    'create_meetings',
    'edit_all_meetings',
    'view_all_visits',
    'create_visits',
    'view_all_visitors',
    'create_visitors',
    'view_all_deliveries',
    'create_deliveries',
    'manage_projects',
    'manage_records'
  ],
  [UserRole.MANAGER]: [
    'view_department_meetings', // Can see general meetings and self department meetings
    'create_meetings',
    'edit_department_meetings', // Can edit meetings in their departments
    'view_department_visits',
    'create_visits',
    'view_department_visitors',
    'create_visitors',
    'view_all_deliveries',
    'create_deliveries',
    'manage_projects',
    'view_employee'
  ],
  [UserRole.EMPLOYEE]: [
    'view_department_meetings',
    'view_department_visits',
    'view_all_deliveries',
    'create_deliveries',
    'view_employee'
  ]
};

export interface IEmployee {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  departments?: string[] | { _id: string; departmentName: string }[];
  jobTitle: string;
  role: UserRole;
  isActive: boolean;
  profileImgUri?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // Backend specific
  requiresPasswordChange?: boolean;
  password?: string;
  refreshToken?: string;

  // Frontend specific
  status?: "Active" | "On Leave" | "Inactive";
}
export type RoleFilter = UserRole | "all";

export interface ActiveEmployeeOption {
  _id: string;
  name: string;
  profileImgUri?: string;
  jobTitle?: string;

}

export type Employee = IEmployee;

export type Guest = {
  id?: string;
  name: string,
  position: string;
  img: string
}

export interface Visitor {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    profileImgUri?: string;
    isVip: boolean;
    isBlocked: boolean;
    notes?: string;
    organizationId?: string;
    companyNameFallback?: string;
    departments: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: UserRole.ADMIN | string;
}
