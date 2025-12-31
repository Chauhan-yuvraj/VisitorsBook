import mongoose, { Schema } from "mongoose";

const scheduleSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
        index: true,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Employees",
        required: true,
    },
    source: {
        type: String,
        enum: ["SELF", "ADMIN", "HOD", "SYSTEM"],
        default: "SELF"
    },
    type: {
        type: String,
        enum: ["LEAVE", "MEETING", "EMERGENCY_OUT", "OFFSITE_WORK", "HALF_DAY"],
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    remarks: {
        type: String,
        trim: true,
    },
    isConfirmed: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

scheduleSchema.index({ employeeId: 1, startTime: 1, endTime: 1 }, { unique: true });
const Schedule = mongoose.model("Schedule", scheduleSchema || mongoose.models.Schedule);

export { Schedule };