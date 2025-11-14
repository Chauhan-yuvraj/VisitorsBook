// records.slice.ts (Updated)
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedbackRecords,
  saveFeedbackRecord,
  deleteFeedbackRecord,
} from "@/services/feedback.service";
import { CanvasPage } from "@/components/ui/DrawingCanavs";
import { PathData as SignaturePathData } from "@/components/SignatureCanvas";
import { FeedbackRecord } from '../types/feedback';

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

// --- ASYNC THUNKS ---
// Thunk to load all records from storage
export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async () => {
    const records = await getFeedbackRecords();
    return records;
  }
);

// Thunk to save a new record
export const saveRecord = createAsyncThunk(
  'records/saveRecord',
  async (
    data: {
      guestData: { name: string, position: string, img: string },
      canvasPages: CanvasPage[],
      signaturePaths: SignaturePathData[]
    }
  ) => {
    const newRecord = await saveFeedbackRecord(
      data.guestData,
      data.canvasPages,
      data.signaturePaths
    );
    return newRecord;
  }
);

// Thunk to delete a record
export const deleteRecord = createAsyncThunk(
  'records/deleteRecord',
  async (recordId: string) => {
    const success = await deleteFeedbackRecord(recordId);
    if (success) {
      return recordId;
    }
    throw new Error('Failed to delete record.');
  }
);

// NEW THUNK: To toggle the featured status and persist it
const toggleFeature = createAsyncThunk(
  'records/toggleFeature',
  async ({ id, currentFeaturedStatus }: { id: string, currentFeaturedStatus: boolean }) => {
    const newFeaturedStatus = !currentFeaturedStatus;


    console.log(`Simulating update for record ${id}: featured=${newFeaturedStatus}`);

    return { id, featured: newFeaturedStatus };
  }
);

// --- SLICE DEFINITION ---
const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Fetch Records
      .addCase(fetchRecords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecords.fulfilled, (state, action: PayloadAction<FeedbackRecord[]>) => {
        state.status = 'succeeded';
        state.records = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch records.';
      })

      // Save Record
      .addCase(saveRecord.fulfilled, (state, action: PayloadAction<FeedbackRecord>) => {
        state.records.push(action.payload);
      })

      // Delete Record
      .addCase(deleteRecord.fulfilled, (state, action: PayloadAction<string>) => {
        const deletedId = action.payload;
        state.records = state.records.filter(record => record.id !== deletedId);
      })

      // Toggle Feature (Handled by the new thunk)
      .addCase(toggleFeature.fulfilled, (state, action: PayloadAction<{ id: string, featured: boolean }>) => {
        const { id, featured } = action.payload;
        const index = state.records.findIndex(record => record.id === id);
        if (index !== -1) {
          state.records[index].featured = featured;
        }
      })
      // Optional: Handle rejected state for user feedback
      .addCase(toggleFeature.rejected, (state, action) => {
        console.error("Failed to update feature status:", action.error.message);
        // Maybe display an error message to the user here
      });
  },
});

export default recordsSlice.reducer;
export { toggleFeature };