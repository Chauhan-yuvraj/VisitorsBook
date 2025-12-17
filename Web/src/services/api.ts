import axios from "axios";
import type { Store, ActionCreatorWithPayload, ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000/api"; // Adjust if needed

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void,
  reject: (error: unknown) => void
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom =>
    error ? prom.reject(error) : prom.resolve(token!)
  );
  failedQueue = [];
}

export const setupInterceptors = (
  store: Store<{ auth: { token: string | null } }>,
  {
    logout,
    refreshSuccess,
  }: {
    logout: ActionCreatorWithoutPayload;
    refreshSuccess: ActionCreatorWithPayload<string>;
  }
) => {
  /* ---------------- Request interceptor ---------------- */
  API.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  );

  /* ---------------- Response interceptor ---------------- */
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return API(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const response = await API.post("/auth/refresh");
          const newToken = response.data.accessToken;
          store.dispatch(refreshSuccess(newToken));
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        } catch (err) {
          processQueue(err, null);
          store.dispatch(logout());
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};

export default API;
