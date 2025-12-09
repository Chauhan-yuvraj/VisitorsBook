/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { Visitor } from "../types/visitor"
import { getVisitors, addVisitor, updateVisitor, deleteVisitor } from "@/services/guest.service"

interface guestState {
    guest: Visitor[]
    error: string
    selectedGuest: Visitor | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: guestState = {
    guest: [],
    error: '',
    selectedGuest: null,
    loading: 'idle'
}

// --- ASYNC THUNKS ---

export const fetchGuestsThunk = createAsyncThunk(
    'guest/fetchGuests',
    async (_, { rejectWithValue }) => {
        try {
            const guests = await getVisitors();
            return guests;
        } catch (error) {
            return rejectWithValue('Failed to load visitors.');
        }
    }
)

export const createGuestThunk = createAsyncThunk(
    'guest/createGuest',
    async (newGuest: Partial<Visitor>, { rejectWithValue }) => {
        try {
            const createdGuest = await addVisitor(newGuest);
            return createdGuest;
        } catch (error) {
            return rejectWithValue('Failed to create visitor.');
        }
    }
)

export const updateGuestThunk = createAsyncThunk(
    'guest/updateGuest',
    async (updatedGuest: Partial<Visitor> & { _id: string }, { rejectWithValue }) => {
        try {
            const result = await updateVisitor(updatedGuest);
            return result;
        } catch (error) {
            return rejectWithValue('Failed to update visitor.');
        }
    }
)

export const deleteGuestThunk = createAsyncThunk(
    'guest/deleteGuest',
    async (guestId: string, { rejectWithValue }) => {
        try {
            await deleteVisitor(guestId);
            return guestId;
        } catch (error) {
            return rejectWithValue('Failed to delete visitor.');
        }
    }
)

// --- REDUX SLICE ---

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        setSelectedGuest: (state, action: PayloadAction<Visitor>) => {
            state.selectedGuest = action.payload
        },
        clearSelectedGuest: (state) => {
            state.selectedGuest = null
        }
    },
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchGuestsThunk.pending, (state) => {
                state.loading = 'pending';
                state.error = '';
            })
            .addCase(fetchGuestsThunk.fulfilled, (state, action: PayloadAction<Visitor[]>) => {
                state.loading = 'succeeded';
                state.guest = action.payload;
            })
            .addCase(fetchGuestsThunk.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string || 'An error occurred fetching visitors.';
            })

        // Create
        builder
            .addCase(createGuestThunk.fulfilled, (state, action: PayloadAction<Visitor>) => {
                state.guest.push(action.payload);
            })
            .addCase(createGuestThunk.rejected, (state, action) => {
                state.error = action.payload as string || 'An error occurred creating visitor.';
            })

        // Update
        builder
            .addCase(updateGuestThunk.fulfilled, (state, action: PayloadAction<Visitor>) => {
                const index = state.guest.findIndex(g => g._id === action.payload._id);
                if (index !== -1) {
                    state.guest[index] = action.payload;
                }
            })
            .addCase(updateGuestThunk.rejected, (state, action) => {
                state.error = action.payload as string || 'An error occurred updating visitor.';
            })

        // Delete
        builder
            .addCase(deleteGuestThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.guest = state.guest.filter(g => g._id !== action.payload);
            })
            .addCase(deleteGuestThunk.rejected, (state, action) => {
                state.error = action.payload as string || 'An error occurred deleting visitor.';
            })
    }
})
export const { setSelectedGuest, clearSelectedGuest } = guestSlice.actions

export default guestSlice.reducer

export type { guestState }