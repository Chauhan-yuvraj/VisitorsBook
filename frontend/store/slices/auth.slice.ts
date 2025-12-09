import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../types/user";
import { loginAdmin } from "@/services/auth.service";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from "expo-constants";

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    user: Admin | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    accessToken: null,
    user: null,
    isLoading: true, // Start as true so we check session first
};

// Get API URL
const fallbackUrl = "http://localhost:3000/api";
const apiUrl: string =
    (Constants.expoConfig?.extra?.apiUrl as string) || fallbackUrl;

// Login thunk
const login = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await loginAdmin(credentials);

            // Store REFRESH TOKEN securely
            await SecureStore.setItemAsync("refreshToken", response.refreshToken);
            console.log("✅ Refresh Token saved to SecureStore");

            return {
                accessToken: response.accessToken,
                user: response.user,
            };
        } catch (error: any) {
            console.error("❌ Login failed:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Logout thunk (async to properly clear SecureStore)
const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        try {
            // Remove refresh token from SecureStore
            await SecureStore.deleteItemAsync("refreshToken");
            console.log("✅ Refresh token removed from SecureStore");
        } catch (error) {
            console.error("❌ Error clearing refresh token:", error);
        }
    }
);

// Restore session thunk - Actually refresh the access token
const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = await SecureStore.getItemAsync("refreshToken");

            if (!refreshToken) {
                console.log("⚠️ No refresh token found");
                return rejectWithValue("No refresh token found");
            }

            console.log("✅ Refresh token found, requesting new access token...");

            // Call refresh endpoint to get new access token
            const response = await axios.post(`${apiUrl}/auth/refresh`, {
                refreshToken: refreshToken
            });

            const { accessToken } = response.data;
            console.log("✅ Session restored with new access token");

            // Note: We don't have user data yet, but we're authenticated
            // You might want to fetch user data here or on next API call
            return {
                accessToken,
                // Optionally fetch user data here if your refresh endpoint returns it
            };

        } catch (error: any) {
            console.error("❌ Session restore failed:", error.message);
            // Clear invalid refresh token
            await SecureStore.deleteItemAsync("refreshToken");
            return rejectWithValue("Failed to restore session");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setNewAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        clearAuthState(state) {
            // Synchronous clear (use logout thunk for full cleanup)
            state.isAuthenticated = false;
            state.accessToken = null;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<{ accessToken: string; user: Admin }>) => {
                    state.isAuthenticated = true;
                    state.accessToken = action.payload.accessToken;
                    state.user = action.payload.user;
                    state.isLoading = false;
                }
            )
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
            });

        // Logout cases
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.user = null;
            state.isLoading = false;
        });

        // Restore session cases
        builder
            .addCase(restoreSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(restoreSession.fulfilled, (state, action: PayloadAction<{ accessToken: string }>) => {
                // Successfully restored session
                state.isAuthenticated = true;
                state.accessToken = action.payload.accessToken;
                state.isLoading = false;
                console.log("✅ User authenticated from restored session");
            })
            .addCase(restoreSession.rejected, (state) => {
                // No valid session to restore
                state.isAuthenticated = false;
                state.accessToken = null;
                state.user = null;
                state.isLoading = false;
                console.log("ℹ️ No session to restore, user needs to login");
            });
    },
});

export const { setNewAccessToken, clearAuthState } = authSlice.actions;
export { login, logout, restoreSession };
export default authSlice.reducer;