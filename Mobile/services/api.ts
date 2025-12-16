import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';
// import { logout, setNewAccessToken } from "@/store/slices/auth.slice"; // Removed to avoid circular dependency

// ---------------------------
// STORE INJECTION SETUP
// ---------------------------
let store: any;
let logoutAction: any;
let setNewAccessTokenAction: any;

export const injectStore = (_store: any) => {
    store = _store;
};

export const injectActions = (logout: any, setNewToken: any) => {
    logoutAction = logout;
    setNewAccessTokenAction = setNewToken;
};

// ---------------------------
// BASE URL SETUP
// ---------------------------
const fallbackUrl = "http://localhost:3000/api";
const apiUrl: string =
    (Constants.expoConfig?.extra?.apiUrl as string) || fallbackUrl;

const API = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// ---------------------------
// REFRESH TOKEN STATE
// ---------------------------
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// ---------------------------
// REQUEST INTERCEPTOR
// ---------------------------
API.interceptors.request.use(
    async (config) => {
        if (store) {
            const state = store.getState();
            const accessToken = state.auth.accessToken;

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        
        // Log request (optional: reduce noise by ignoring specific paths)
        if (!config.url?.includes('refresh')) {
             const finalUrl = axios.getUri(config as AxiosRequestConfig);
             console.log(`📤 Request: ${config.method?.toUpperCase()} ${finalUrl}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ---------------------------
// RESPONSE INTERCEPTOR
// ---------------------------
API.interceptors.response.use(
    (response) => {
        console.log(`✅ Response: ${response.status} ${response.config.url}`);
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // 1. Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Prevent infinite loops if the refresh endpoint itself returns 401
            if (originalRequest.url?.includes('/auth/refresh')) {
                console.warn("🔒 Refresh token expired, logging out...");
                if (store && logoutAction) {
                    await store.dispatch(logoutAction());
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // If already refreshing, add this request to queue and wait
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = "Bearer " + token;
                        return API(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 2. Get Refresh Token from SecureStore
                console.log("🔄 Attempting to refresh access token...");
                const refreshToken = await SecureStore.getItemAsync("refreshToken");

                if (!refreshToken) {
                    console.warn("⚠️ No refresh token found in SecureStore");
                    throw new Error("No refresh token available");
                }

                console.log("✅ Refresh token retrieved from SecureStore");

                // 3. Call Backend to Refresh
                const response = await axios.post(`${apiUrl}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { accessToken } = response.data;
                console.log("✅ New access token received");

                // 4. Update Redux Store
                if (store && setNewAccessTokenAction) {
                    store.dispatch(setNewAccessTokenAction(accessToken));
                }

                // 5. Update the header for the retry
                API.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
                originalRequest.headers["Authorization"] = "Bearer " + accessToken;

                // 6. Process Queue (retry other failed requests)
                processQueue(null, accessToken);
                
                // 7. Retry the original failed request
                return API(originalRequest);

            } catch (refreshError: any) {
                // Refresh failed (token expired, invalid, or missing)
                console.error("❌ Token refresh failed:", refreshError.message);
                processQueue(refreshError, null);
                
                if (store && logoutAction) {
                    console.warn("🚪 Session expired, logging out...");
                    await store.dispatch(logoutAction());
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Standard Error Logging
        console.log("❌ Response Error:", error.response?.status || error.message);

        if (isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                console.error("⏳ Timeout: API request took too long.");
            }
            if (error.code === "ERR_NETWORK") {
                console.error("🌐 Network Error: Check if backend is running");
            }
        }

        return Promise.reject(error);
    }
);

export default API;