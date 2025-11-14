import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
    getFeedbackRecords, 
    saveFeedbackRecord, 
    deleteFeedbackRecord, 
    FeedbackRecord 
} from "@/services/feedback.service";
import { CanvasPage } from "@/components/ui/DrawingCanavs";
import { PathData as SignaturePathData } from "@/components/SignatureCanvas";

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
      guestData: { name: string, position: string },
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

// --- SLICE DEFINITION ---

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {},
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
      });
  },
});

export default recordsSlice.reducer;