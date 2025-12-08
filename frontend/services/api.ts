import axios, { AxiosRequestConfig } from "axios";
import Constants from "expo-constants";

const fallbackUrl = "http://localhost:3000/api";
const apiUrl: string = (Constants.expoConfig?.extra?.apiUrl as string) || fallbackUrl;

if (!apiUrl.startsWith('http')) {
    console.error(`CRITICAL ERROR: API URL (${apiUrl}) is missing 'http://' scheme.`);
}


const API = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        // Use axios.getUri to log the fully resolved URL, which is much clearer for debugging
        const finalUrl = axios.getUri(config as AxiosRequestConfig);
        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${finalUrl}`);
        return config;
    },
    (error) => {
        console.error("❌ API Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
API.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        // --- Detailed Error Handling ---
        const configBaseURL = error.config?.baseURL;

        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
                console.error("❌ API Error: Request timeout");
            } else if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
                console.error("❌ API Error: Network error occurred.");
                console.error("   Check if backend is running at:", configBaseURL);
                console.error("   💡 Tips:");
                console.error("   - Ensure backend server is running");
                console.error("   - If on physical device, use your computer's correct IP address (e.g., 192.168.x.x)");
                console.error("   - If on Android emulator, try http://10.0.2.2:3000/api");
                console.error("   - Check firewall settings");
            } else if (error.response) {
                // Server responded with an error status (4xx, 5xx)
                console.error("❌ API Error Response:", error.response.status, error.response.data);
            } else {
                // Other Axios errors (e.g., URL scheme failure)
                console.error("❌ API Error (Other):", error.message);
            }
        } else {
            console.error("❌ API Error (Unknown):", (error as Error).message || error);
        }

        return Promise.reject(error);
    }
);

export default API;