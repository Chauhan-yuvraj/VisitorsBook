import mongoose, { Schema } from "mongoose";

export interface IMeeting {
  _id: string;
  organizer: Schema.Types.ObjectId; // User ID of the organizer
  host: Schema.Types.ObjectId; // User ID of the host
  participants: Schema.Types.ObjectId[]; // Array of user IDs
  title: string;
  agenda?: string;
  location?: string; // Physical location or meeting link
  isVirtual: boolean;
  timeSlots: {
    date: string; // ISO date string
    startTime: Date; // ISO datetime
    endTime: Date; // ISO datetime
  }[];
  remarks?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const meetingTimeSlotSchema = new Schema({
  date: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { _id: false });

const meetingSchema = new Schema<IMeeting>(
  {
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    }],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    isVirtual: {
      type: Boolean,
      required: true,
    },
    timeSlots: [meetingTimeSlotSchema],
    remarks: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ host: 1 });
meetingSchema.index({ participants: 1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ "timeSlots.startTime": 1, "timeSlots.endTime": 1 });

export const Meeting =
  mongoose.models.Meeting ||
  mongoose.model<IMeeting>("Meeting", meetingSchema);