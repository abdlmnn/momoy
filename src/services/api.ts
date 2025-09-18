import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getProducts() {
  try {
    const res = await api.get(`/api/products/`);
    console.log('Fetched Products:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Fetching Products:', error);
  }
}

export async function getCategories() {
  try {
    const res = await api.get(`/api/categories/`);
    console.log('Fetched Categories:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Fetching Categories:', error);
  }
}

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');

  // console.log(token);

  if (token && !config.url?.includes('/auth/google/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loops
      const refresh = await AsyncStorage.getItem('refresh');

      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh,
          });
          const newAccess = res.data.access;

          // console.log(newAccess);

          await AsyncStorage.setItem('access', newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await AsyncStorage.multiRemove(['access', 'refresh']);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
