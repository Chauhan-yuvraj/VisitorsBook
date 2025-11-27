  export interface IEmployee {
    name: string;
    email: string;
    phone?: string;
    profileImgUri?: string;
    department?: string;
    jobTitle?: string;
    role: "ADMIN" | "HOST" | "SECURITY" | "RECEPTION";
    requiresPasswordChange: boolean;
    password?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }