import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Authenticated API with refresh interceptor
const authApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token before each request
authApi.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → refresh token
authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = await AsyncStorage.getItem('refresh');
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh,
          });
          const newAccess = res.data.access;

          await AsyncStorage.setItem('access', newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return authApi(originalRequest); // retry with updated token
        } catch (refreshError) {
          console.error('Refresh failed → logout', refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default authApi;
