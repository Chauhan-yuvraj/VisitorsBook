import mongoose, { Schema } from "mongoose";

const attachmentSchema = new Schema(
  {
    // --- LINK TO THE VISIT ---
    visitId: { 
      type: Schema.Types.ObjectId, 
      ref: "Visit", 
      required: true,
      index: true // <--- CRITICAL: Makes loading assets for a visit fast
    },

    // --- FILE DETAILS ---
    url: { type: String, required: true, trim: true }, // S3 or Cloudinary URL
    
    type: { 
      type: String, 
      enum: ["IMAGE", "VIDEO", "DOCUMENT", "AUDIO"], 
      required: true 
    },

    title: { type: String, trim: true }, // e.g., "Whiteboard Snapshot", "Meeting Recording"
    
    // Optional: Tech details
    format: { type: String }, // "mp4", "jpg", "pdf"
    sizeInBytes: { type: Number }, 
  },
  { 
    timestamps: true 
  }
);

export const Attachment = mongoose.models.Attachment || mongoose.model("Attachment", attachmentSchema);