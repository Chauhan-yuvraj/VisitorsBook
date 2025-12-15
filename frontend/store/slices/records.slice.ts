import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  saveUserRecord,
} from "@/services/feedback.service";

import { FeedbackRecord, UserRecord, SerializablePathData, SerializableCanvasPage } from '../types/feedback';
import { deleteRecordFromAPI, getRecordsFromAPI } from '@/services/records.service';

interface RecordsState {
  records: FeedbackRecord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RecordsState = {
  records: [],
  status: 'idle',
  error: null,
};

type SaveRecordPayload = {
  guestData: UserRecord;
  canvasPages: SerializableCanvasPage[];
  signaturePaths: SerializablePathData[];
  visitType: string;
  feedbackText?: string;
  audio?: string;
  images?: string[];
};


export const getRecords = createAsyncThunk(
  'records/getRecords',
  async () => {
    const records = await getRecordsFromAPI();
    return records as FeedbackRecord[];
  })

// Thunk to save a new record
export const saveRecord = createAsyncThunk(
  'records/saveRecord',
  async (
    data: SaveRecordPayload,
    { rejectWithValue }
  ) => {
    try {
      const { guestData, canvasPages, signaturePaths, visitType, feedbackText, audio, images } = data;

      const record = await saveUserRecord(guestData, canvasPages, signaturePaths, visitType, feedbackText, audio, images);
      return record as FeedbackRecord;

    } catch (error: any) {
      if (error.response) {
        console.error("❌ Server error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("❌ No response - Check if server is running");
        console.error("Request:", error.request);
      } else {
        console.error("❌ Request setup error:", error.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRecord = createAsyncThunk(
  'records/deleteRecord',
  async (id: string) => {
    // Implement delete logic here
    const response = await deleteRecordFromAPI(id);
    return response;
  }
);

// Thunk to toggle the featured status
const toggleFeature = createAsyncThunk(
  'records/toggleFeature',
  async ({ id, currentFeaturedStatus }: { id: string, currentFeaturedStatus: boolean }) => {
    const newFeaturedStatus = !currentFeaturedStatus;
    console.log(`Simulating update for record ${id}: featured=${newFeaturedStatus}`);
    return { id, featured: newFeaturedStatus };
  }
);

// Slice definition
const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Get Records
      .addCase(getRecords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRecords.fulfilled, (state, action: PayloadAction<FeedbackRecord[]>) => {
        state.status = 'succeeded';
        state.records = action.payload;
      })
      .addCase(getRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      // Save Record
      .addCase(saveRecord.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveRecord.fulfilled, (state) => {
        state.status = 'succeeded';
        // Action: Record successfully saved to API.
        // We DO NOT push to state.records, relying on a future fetch to update the list.
      })
      .addCase(saveRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || action.error.message || null;
      })
      // Delete Record
      .addCase(deleteRecord.fulfilled, (state, action: PayloadAction<void, string, { arg: string }>) => {
        const idToDelete = action.meta.arg;
        state.records = state.records.filter(record => record.id !== idToDelete);
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Toggle Feature
      .addCase(toggleFeature.fulfilled, (state, action: PayloadAction<{ id: string, featured: boolean }>) => {
        const { id, featured } = action.payload;
        const index = state.records.findIndex(record => record.id === id);
        if (index !== -1) {
          state.records[index].guest.featured = featured;
        }
      })
      .addCase(toggleFeature.rejected, (state, action) => {
        console.error("Failed to update feature status:", action.error.message);
      });
  },
});



export default recordsSlice.reducer;
export { toggleFeature };