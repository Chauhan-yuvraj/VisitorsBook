import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import guestReducer from "./slices/guest.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        guest: guestReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
