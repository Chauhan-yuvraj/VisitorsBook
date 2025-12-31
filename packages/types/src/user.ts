export enum UserRole {
  EMPLOYEE = 'employee',
  HR = 'hr',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export interface IEmployee {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  departmentId?: string | { _id: string; departmentName: string };
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

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: UserRole.ADMIN | string;
}
