import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socialApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

socialApi.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access');

  // console.log(token);

  if (token && !config.url?.includes('/google/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

socialApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loops
      const refresh = await AsyncStorage.getItem('refresh');

      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/token/refresh/`, {
            refresh,
          });
          const newAccess = res.data.access;

          // console.log(newAccess);

          await AsyncStorage.setItem('access', newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return socialApi(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await AsyncStorage.multiRemove(['access', 'refresh']);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default socialApi;
