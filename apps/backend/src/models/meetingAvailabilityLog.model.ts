import mongoose, { Schema } from "mongoose";

export interface IMeetingAvailabilityLog extends Document {
  _id: string;
  meetingId: Schema.Types.ObjectId;
  employeeId: Schema.Types.ObjectId;
  timeSlot: {
    startTime: Date;
    endTime: Date;
  };
  availabilityStatus: 'available' | 'unavailable' | 'has_meeting' | 'out_of_office';
  reason?: string; // Reason for unavailability
  conflictingMeetingId?: Schema.Types.ObjectId; // If there's a conflicting meeting
  checkedAt: Date;
}

const meetingAvailabilityLogSchema = new Schema<IMeetingAvailabilityLog>(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    timeSlot: {
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true },
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'unavailable', 'has_meeting', 'out_of_office'],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    conflictingMeetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
    },
  },
  { timestamps: { createdAt: 'checkedAt' } }
);

// Indexes
meetingAvailabilityLogSchema.index({ meetingId: 1 });
meetingAvailabilityLogSchema.index({ employeeId: 1 });
meetingAvailabilityLogSchema.index({ "timeSlot.startTime": 1, "timeSlot.endTime": 1 });

export const MeetingAvailabilityLog =
  mongoose.models.MeetingAvailabilityLog ||
  mongoose.model<IMeetingAvailabilityLog>("MeetingAvailabilityLog", meetingAvailabilityLogSchema);