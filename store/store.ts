import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import guestReducer from "./slices/guest.slice";
import canvasReducer from "./slices/canvas.slice";
import recordsReducer from './slices/records.slice'; // <-- NEW IMPORT


export const store = configureStore({
    reducer: {
        auth: authReducer,
        guest: guestReducer,
        canvas: canvasReducer,
        records: recordsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
