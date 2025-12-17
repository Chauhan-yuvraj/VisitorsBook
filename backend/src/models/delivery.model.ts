import mongoose, { Schema } from "mongoose";

const deliverySchema = new Schema(
  {
    // --- RECIPIENT ---
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    // --- PACKAGE DETAILS ---
    carrier: {
      type: String,
      enum: ["DHL", "FEDEX", "UPS", "AMAZON", "FOOD", "OTHER"],
      default: "OTHER"
    },

    labelPhotoUrl: { type: String }, // Photo of the name on the box

    // Optional: Tracking number scan
    trackingNumber: { type: String, trim: true },

    // --- LIFECYCLE ---
    status: {
      type: String,
      enum: ["PENDING", "COLLECTED", "RETURNED", "REJECTED"],
      default: "PENDING",
      index: true
    },

    // --- TIMESTAMPS ---
    // createdAt = When it arrived at the desk
    collectedAt: { type: Date }, // When employee picked it up

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true
  }
);

export const Delivery = mongoose.models.Delivery || mongoose.model("Delivery", deliverySchema);