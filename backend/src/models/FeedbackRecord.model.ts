import mongoose from "mongoose";
import { canvasPageSchema, pathDataSchema } from "./sharedSchemas";

const FeedbackRecordModel = new mongoose.Schema({

    VisitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true, index: true },

    visitType: { type: String , required: true },
    timeStamp: { type: String, required: true },
    feedbackText: { type: String },
    audio: { type: String },
    images: { type: [String], default: [] },

    signature: {
        type: [pathDataSchema],
        required: true,
        default: [],
    },

    pages: {
        type: [canvasPageSchema],
        required: true,
        default: [],
    }
});

export const FeedbackRecord = mongoose.model("FeedbackRecord", FeedbackRecordModel, 'feedbackRecords');
