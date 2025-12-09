// store/types/user.ts

export enum UserRole {
  EMPLOYEE = 'employee',
  HR = 'hr',
  ADMIN = 'admin',
  EXECUTIVE = 'executive'
}

export interface Employee {
  _id: string; // Changed from 'id' to '_id' to match API
  name: string;
  email: string;
  phone?: string;
  department?: string;
  jobTitle: string;
  role: UserRole | string; // Allow string to handle API "employee" text
  isActive: boolean;
  status?: "Active" | "On Leave" | "Inactive"; // Optional if calculated on frontend
  profileImgUri?: string;
  createdAt?: string;
}

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