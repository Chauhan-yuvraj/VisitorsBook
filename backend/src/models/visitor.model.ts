import mongoose, { Schema } from "mongoose";

// --- Main Visitor Schema ---
const visitorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // Required, mapped from guestName
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    }, // Mapped from guestEmail

    phone: { type: String, trim: true, sparse: true },

    profileImgUri: { type: String }, // guestImgUri

    isVip: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    notes: { type: String },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    companyNameFallback: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Visitor =
  mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
