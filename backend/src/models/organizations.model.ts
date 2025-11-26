import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    
    // Using ENUM ensures data consistency
    type: { 
      type: String, 
      enum: ["VENDOR", "PARTNER", "CLIENT"], 
      default: "PARTNER" 
    },
    
    contractStatus: { 
      type: String, 
      enum: ["ACTIVE", "EXPIRED", "PENDING"], 
      default: "ACTIVE" 
    },
    
    website: { type: String, trim: true },
    logoUrl: { type: String, trim: true },

    // --- RELATIONSHIP ---
    // Links to your internal Employee (Account Manager)
    accountManagerId: { 
      type: Schema.Types.ObjectId, 
      ref: "Employee" // <--- CRITICAL: Links to your Employee model
    }
  },
  { timestamps: true }
);

export const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);