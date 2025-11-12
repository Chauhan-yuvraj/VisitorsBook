import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Guest } from "../types/guest.type";

interface AuthState {
    user: string | null;
    isAuthenticated: boolean;
    error: string | null;
}



const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    error: null,
};

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ username: string; password: string }>) => {
            const { username, password } = action.payload;
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                state.user = username;
                state.isAuthenticated = true;
                state.error = null;
            } else {
                state.error = "Invalid username or password";
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
