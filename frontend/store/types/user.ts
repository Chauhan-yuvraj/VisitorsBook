// store/types/user.ts

export enum UserRole {
  EMPLOYEE = 'employee',
  HR = 'hr',
  ADMIN = 'admin',
  EXECUTIVE = 'executive'
}

export interface Employee {
  _id: string; // Changed from 'id' to '_id' to match API
  id?: string; // Kept optional just in case
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