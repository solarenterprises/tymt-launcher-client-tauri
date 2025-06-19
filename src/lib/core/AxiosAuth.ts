import axios from "axios";

import { CONFIG_TYMT_BACKEND_URL } from "../../config/MainConfig";
import { authStorage } from "../storage/authStorage";

const axiosAuth = axios.create({
  baseURL: `${CONFIG_TYMT_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the Bearer token
axiosAuth.interceptors.request.use(
  (config) => {
    const auth = authStorage.get();
    if (auth && auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (e.g., 401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Refresh the access token using the refresh token
        const auth = authStorage.get();
        if (!auth || !auth.refreshToken) {
          throw new Error("No refresh token found");
        }

        const response = await axios.post(`${CONFIG_TYMT_BACKEND_URL}/api/auth/refresh-token`, { refreshToken: auth.refreshToken });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data?.data;

        // Update the access token in local storage and headers
        authStorage.set({ ...auth, accessToken: newAccessToken, refreshToken: newRefreshToken });

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosAuth(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout the user)
        console.error("Failed to refresh token:", refreshError);
        authStorage.remove();
        window.location.href = "/"; // Redirect to splash page
        return Promise.reject(refreshError);
      }
    }

    // If the error is not due to token expiration, reject the promise
    return Promise.reject(error);
  }
);

export default axiosAuth;
