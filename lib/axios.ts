import axios, { AxiosError, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExp: number;
  refreshTokenExp: number;
}

export const storeTokens = async (
  accessToken: string,
  refreshToken: string,
  accessTokenExp: number,
  refreshTokenExp: number
) => {
  await SecureStore.setItemAsync("accessToken", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
  await SecureStore.setItemAsync("accessTokenExp", accessTokenExp.toString());
  await SecureStore.setItemAsync("refreshTokenExp", refreshTokenExp.toString());
};

export const deleteTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  await SecureStore.deleteItemAsync("accessTokenExp");
  await SecureStore.deleteItemAsync("refreshTokenExp");
};
const baseURL =
  process.env.EXPO_PUBLIC_API_ENDPOINT ?? "https://api.avenaa.co.in/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "x-app-type": "mobile",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (accessToken) {
      config.headers["X-Access-Token"] = accessToken;
    }
    config.headers["X-App-Type"] = "mobile";
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check for new tokens in response headers
    const newAccessToken = response.headers["x-new-access-token"];
    const newRefreshToken = response.headers["x-new-refresh-token"];
    const newAccessTokenExp = response.headers["x-new-access-token-exp"];
    const newRefreshTokenExp = response.headers["x-new-refresh-token-exp"];

    if (newAccessToken && newRefreshToken) {
      storeTokens(
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken && error.config) {
        try {
          // Add refresh token to the retry request
          error.config.headers["X-Refresh-Token"] = refreshToken;
          return axiosInstance(error.config);
        } catch (refreshError) {
          // If refresh fails, redirect to login
          // You'll need to implement this based on your navigation setup
          // navigation.navigate('Login');
        }
      }
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

export default axiosInstance;
