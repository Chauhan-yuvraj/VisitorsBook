/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { Guest } from "../types/guest.type"
import { getStoredGuests, setStoredGuests } from "@/services/guest.service"



interface guestState {
    guest: Guest[]
    error: string
    selectedGuest: Guest | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}
// Define the sample guest data

const initialState: guestState = {
    // Initialize the guest array with one default guest
    guest: [],
    error: '',
    selectedGuest: null,
    loading: 'idle'
}

// --- ASYNC THUNKS FOR STORAGE INTERACTION ---

/** Thunk to load all guests from local storage */
export const fetchGuestsThunk = createAsyncThunk(
    'guest/fetchGuests',
    async (_, { rejectWithValue }) => {
        try {
            const guests = await getStoredGuests();
            return guests;
        } catch (error) {
            return rejectWithValue('Failed to load guests from storage.');
        }
    }
)

/** Thunk to add a new guest and save the updated list to local storage */
export const createGuestThunk = createAsyncThunk(
    'guest/createGuest',
    async (newGuest: Guest, { getState, rejectWithValue }) => {
        try {
            const state = (getState() as { guest: guestState }).guest;


            if (!(newGuest as { id: string }).id) {
                // In a real app, use a proper UUID or timestamp combination
                (newGuest as { id: string | number }).id = Date.now().toString();
            }

            const updatedList = [...state.guest, newGuest];
            await setStoredGuests(updatedList);
            return newGuest;
        } catch (error) {
            return rejectWithValue('Failed to save new guest.',);
        }
    }
)

// --- REDUX SLICE ---

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        setSelectedGuest: (state, action: PayloadAction<Guest>) => {
            state.selectedGuest = action.payload
        },
        clearSelectedGuest: (state) => {
            state.selectedGuest = null
        }
    },
    extraReducers: (builder) => {
        // 1. Handle Fetch Guests (Loading state)
        builder
            .addCase(fetchGuestsThunk.pending, (state) => {
                state.loading = 'pending';
                state.error = '';
            })
            .addCase(fetchGuestsThunk.fulfilled, (state, action: PayloadAction<Guest[]>) => {
                state.loading = 'succeeded';
                state.guest = action.payload;
            })
            .addCase(fetchGuestsThunk.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string || 'An error occurred fetching guests.';
            })

        // 2. Handle Create Guest (Saving state)
        builder
            .addCase(createGuestThunk.pending, (state) => {
                // Optionally show a temporary UI loader here
                state.error = '';
            })
            .addCase(createGuestThunk.fulfilled, (state, action: PayloadAction<Guest>) => {
                // Add the newly created guest (which includes the assigned ID)
                state.guest.push(action.payload);
            })
            .addCase(createGuestThunk.rejected, (state, action) => {
                state.error = action.payload as string || 'An error occurred creating guest.';
            })
    }
})
export const { setSelectedGuest, clearSelectedGuest } = guestSlice.actions

export default guestSlice.reducer

export type { guestState }