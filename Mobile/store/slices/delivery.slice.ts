import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Delivery, CreateDeliveryPayload } from "../types/delivery";
import { getDeliveries, createDelivery, updateDeliveryStatus } from "@/services/delivery.service";

interface DeliveryState {
    deliveries: Delivery[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DeliveryState = {
    deliveries: [],
    loading: 'idle',
    error: null,
};

export const fetchDeliveriesThunk = createAsyncThunk(
    'delivery/fetchDeliveries',
    async (_, { rejectWithValue }) => {
        try {
            return await getDeliveries();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDeliveryThunk = createAsyncThunk(
    'delivery/createDelivery',
    async (data: CreateDeliveryPayload, { rejectWithValue }) => {
        try {
            return await createDelivery(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateDeliveryStatusThunk = createAsyncThunk(
    'delivery/updateStatus',
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            return await updateDeliveryStatus(id, status);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliveriesThunk.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchDeliveriesThunk.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.deliveries = action.payload;
            })
            .addCase(fetchDeliveriesThunk.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createDeliveryThunk.fulfilled, (state, action) => {
                state.deliveries.unshift(action.payload);
            })
            .addCase(updateDeliveryStatusThunk.fulfilled, (state, action) => {
                const index = state.deliveries.findIndex(d => d._id === action.payload._id);
                if (index !== -1) {
                    state.deliveries[index] = action.payload;
                }
            });
    },
});

export default deliverySlice.reducer;
