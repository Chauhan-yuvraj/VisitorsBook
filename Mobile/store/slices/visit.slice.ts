import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Visit, CreateVisitPayload, UpdateVisitPayload } from "../types/visit";
import { getVisits, scheduleVisit, updateVisit, deleteVisit } from "@/services/visits.service";

interface VisitState {
    visits: Visit[];
    error: string | null;
    selectedVisit: Visit | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: VisitState = {
    visits: [],
    error: null,
    selectedVisit: null,
    loading: 'idle',
};

export const fetchVisitsThunk = createAsyncThunk(
    'visits/fetchVisits',
    async ({ status, hostId }: { status?: string; hostId?: string } = {}, { rejectWithValue }) => {
        const result = await getVisits(status, hostId);
        if (result.success && result.data) {
            return result.data;
        } else {
            return rejectWithValue(result.error || 'Failed to fetch visits');
        }
    }
);

export const scheduleVisitThunk = createAsyncThunk(
    'visits/scheduleVisit',
    async (payload: CreateVisitPayload, { rejectWithValue }) => {
        const result = await scheduleVisit(payload);
        if (result.success && result.data) {
            return result.data;
        } else {
            return rejectWithValue(result.error || 'Failed to schedule visit');
        }
    }
);

export const updateVisitThunk = createAsyncThunk(
    'visits/updateVisit',
    async ({ id, payload }: { id: string; payload: UpdateVisitPayload }, { rejectWithValue }) => {
        const result = await updateVisit(id, payload);
        if (result.success && result.data) {
            return result.data;
        } else {
            return rejectWithValue(result.error || 'Failed to update visit');
        }
    }
);

export const deleteVisitThunk = createAsyncThunk(
    'visits/deleteVisit',
    async (id: string, { rejectWithValue }) => {
        const result = await deleteVisit(id);
        if (result.success) {
            return id;
        } else {
            return rejectWithValue(result.error || 'Failed to delete visit');
        }
    }
);

const visitSlice = createSlice({
    name: 'visits',
    initialState,
    reducers: {
        setSelectedVisit(state, action: PayloadAction<Visit | null>) {
            state.selectedVisit = action.payload;
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchVisitsThunk.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchVisitsThunk.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.visits = action.payload;
            })
            .addCase(fetchVisitsThunk.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })
            // Schedule
            .addCase(scheduleVisitThunk.fulfilled, (state, action) => {
                state.visits.unshift(action.payload);
            })
            // Update
            .addCase(updateVisitThunk.fulfilled, (state, action) => {
                const index = state.visits.findIndex(v => v._id === action.payload._id);
                if (index !== -1) {
                    state.visits[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteVisitThunk.fulfilled, (state, action) => {
                state.visits = state.visits.filter(v => v._id !== action.payload);
            });
    },
});

export const { setSelectedVisit, clearError } = visitSlice.actions;
export default visitSlice.reducer;
