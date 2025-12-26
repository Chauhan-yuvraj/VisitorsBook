import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema(
    {
        departmentName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        departmentCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        }
    },
)

export const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);