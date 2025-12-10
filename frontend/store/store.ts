import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import guestReducer from "./slices/guest.slice";
import canvasReducer from "./slices/canvas.slice";
import recordsReducer from './slices/records.slice'; // <-- NEW IMPORT
import employeesReducer from './slices/employees.slice'; // <-- NEW IMPORT
import visitReducer from './slices/visit.slice';
import deliveryReducer from './slices/delivery.slice';
import { injectStore } from "@/services/api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        guest: guestReducer,
        canvas: canvasReducer,
        records: recordsReducer,
        employees: employeesReducer, // <-- NEW SLICE
        visits: visitReducer,
        delivery: deliveryReducer,
    },
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
