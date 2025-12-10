import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema(
  {
    // --- 1. VISITOR SNAPSHOT ---
    // We embed these details so the Dashboard loads instantly without lookups
    visitor: {
      id: { type: Schema.Types.ObjectId, ref: "Visitor", required: true },
      name: { type: String, trim: true, required: true },
      email: { type: String, trim: true }, 
      profileImgUri: { type: String, trim: true },
      company: { type: String, trim: true },
      isVip: { type: Boolean, default: false },
    },

    // --- 2. HOST SNAPSHOT ---
    host: {
      id: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
      name: { type: String, trim: true, required: true },
      department: { type: String, trim: true },
      profileImgUri: { type: String, trim: true },
    },

    // --- 3. STATUS & TYPE ---
    status: {
      type: String,
      enum: ["PENDING", "CHECKED_IN", "CHECKED_OUT", "DECLINED", "MISSED"],
      default: "PENDING",
      required: true,
      index: true, // Index this! You will query by status frequently.
    },
    
    isWalkIn: { type: Boolean, default: false },
    purpose: { type: String, trim: true }, // Topic/Reason for the visit

    // --- 4. TIMESTAMPS ---
    scheduledCheckIn: { type: Date },
    actualCheckIn: { type: Date },
    actualCheckOut: { type: Date },

    // --- 5. LEGAL & COMPLIANCE ---
    legal: {
      ndaSigned: { type: Boolean, default: false },
      signatureUrl: { type: String, trim: true }, // The image of the signature
      signedAt: { type: Date },
    },

    // --- 6. POST-VISIT DATA ---
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true },
    },
    
    meetingMinutes: { type: String, trim: true }, // Notes added by Host after
  },
  { 
    timestamps: true 
  }
);

export const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);