import mongoose, { Schema } from "mongoose";

const EmployeeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    
    email: {
      type: String,
      required: true, // Employees usually MUST have an email to get notifications
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: String, trim: true },
    
    profileImgUri: { type: String }, // Used for the "Host Snapshot"

    department: { type: String, trim: true },
    jobTitle: { type: String, trim: true },

    role: { 
      type: String, 
      enum: ["ADMIN", "HOST", "SECURITY", "RECEPTION"], 
      default: "HOST",
      trim: true 
    },

    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true 
  }
);

export const Employee = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);