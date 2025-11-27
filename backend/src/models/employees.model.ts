import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { IEmployee } from "../types/Employee";

// 2. The Methods Interface (Just the custom functions)
export interface IEmployeeMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type EmployeeModel = Model<IEmployee, {}, IEmployeeMethods>;

const EmployeeSchema = new Schema<IEmployee, EmployeeModel, IEmployeeMethods>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: String, trim: true },
    profileImgUri: { type: String },
    department: { type: String, trim: true },
    jobTitle: { type: String, trim: true },

    role: {
      type: String,
      enum: ["ADMIN", "HOST", "SECURITY", "RECEPTION"],
      default: "HOST",
      trim: true,
    },

    requiresPasswordChange: { type: Boolean, default: true },

    password: {
      type: String,
      required: false,
      select: false,
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// --- 5. PRE-SAVE HOOK ---
EmployeeSchema.pre("save", async function (next) {
 
  if (!this.isModified("password")) return next();

  // Guard: Ensure password exists
  if (!this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    return next(error);
  }
});

// --- 6. METHODS ---
EmployeeSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // 'this' refers to the document instance
  if (!this.password) {
    throw new Error("Password not selected");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- 7. EXPORT ---
// We cast the existing model or create a new one with the correct Model Type
export const Employee =
  (mongoose.models.Employee as EmployeeModel) ||
  mongoose.model<IEmployee, EmployeeModel>("Employee", EmployeeSchema);