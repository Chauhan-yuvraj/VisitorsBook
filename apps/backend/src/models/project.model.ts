import moongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        ProjectManagerId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
        },
        teamMemberIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Employee",
            }
        ],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"],
            default: "PLANNING",
            index: true,
        },
        statusHstory: [
            {
                status: String,
                remarks: String,
                updatedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "Employee",
                },

                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],

    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Project = moongoose.models.Project || moongoose.model("Project", ProjectSchema);