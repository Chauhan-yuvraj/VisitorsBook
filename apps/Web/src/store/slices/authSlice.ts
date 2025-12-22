import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import type { Employee } from '@/types/user';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    role: string;
    permissions: string[];
    iat: number;
    exp: number;
}

interface AuthState {
    user: Employee | null;
    token: string | null;
    permissions: string[];
    role: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Helper to load state from localStorage
const loadState = (): Partial<AuthState> => {
    try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        let permissions: string[] = [];
        let role: string | null = null;

        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            permissions = decoded.permissions || [];
            role = decoded.role || null;
        }

        return {
            token: token || null,
            user: user ? JSON.parse(user) : null,
            permissions,
            role,
            isAuthenticated: !!token,
        };
    } catch (error) {
        console.error("Failed to load auth state from storage", error);
        return {};
    }
};

const loadedState = loadState();

const initialState: AuthState = {
    user: null,
    token: null,
    permissions: [],
    role: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    ...loadedState
};

// Async Thunk for Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.login(email, password);
            console.log(response)
            return response;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getMe();
            return response.data;
        } catch (error: unknown) {
            return rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await authService.logout();
        } catch (error: unknown) {
            console.error("Logout failed", error);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        refreshSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload); // Persist token
            if (action.payload) {
                try {
                    const decoded = jwtDecode<DecodedToken>(action.payload);
                    state.permissions = decoded.permissions || [];
                    state.role = decoded.role || null;
                } catch (error) {
                    console.error("Failed to decode token", error);
                    state.permissions = [];
                    state.role = null;
                }
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.permissions = [];
            state.role = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('token'); // Clear storage
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;

                // Persist to localStorage
                localStorage.setItem('token', action.payload.accessToken);
                localStorage.setItem('user', JSON.stringify(action.payload.user));

                if (action.payload.accessToken) {
                    try {
                        const decoded = jwtDecode<DecodedToken>(action.payload.accessToken);
                        state.permissions = decoded.permissions || [];
                        state.role = decoded.role || null;
                        console.log(state.permissions)
                    } catch (error) {
                        console.error("Failed to decode token", error);
                        state.permissions = [];
                        state.role = null;
                    }
                }
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.permissions = [];
                state.role = null;
                state.error = action.payload as string;
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                // Update persisted user
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.permissions = [];
                state.role = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.permissions = [];
                state.role = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });
    },
});

export const { logout, clearError, refreshSuccess } = authSlice.actions;
export default authSlice.reducer;

