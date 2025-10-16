import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../types/types';
import authApi from './authApi';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiGoogle = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiGoogle.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access');

  // console.log(token);

  if (token && !config.url?.includes('/google/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiGoogle.interceptors.response.use(
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

export const saveTokens = async (access: string, refresh: string) => {
  await AsyncStorage.setItem('access', access);
  await AsyncStorage.setItem('refresh', refresh);
};

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

export async function getInventory() {
  try {
    const res = await api.get(`/api/inventory/`);
    console.log('Fetched Inventory:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Fetching Inventory:', error);
  }
}

export async function getUserAddress(): Promise<Address[]> {
  try {
    const res = await authApi.get(`/auth/addresses/`);
    console.log('Fetched Address:', res.data);
    return res.data as Address[];
  } catch (error) {
    console.log('Error Fetching Address:', error);
    return [];
  }
}

export async function getCart() {
  try {
    const res = await authApi.get(`/api/cart/`);
    console.log('Fetched Cart:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Fetching Cart:', error);
    throw error;
  }
}

export async function addToCart(inventoryId: number, quantity: number = 1) {
  try {
    const res = await authApi.post(`/api/cart/`, {
      inventory: inventoryId,
      quantity,
    });

    console.log('Added to Cart:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Adding to Cart:', error);
    throw error;
  }
}

export async function updateCartItem(cartLineId: number, quantity: number) {
  try {
    const res = await authApi.put(`/api/cart/line/${cartLineId}/`, {
      quantity,
    });
    console.log('Updated Cart Item:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Updating Cart Item:', error);
    throw error;
  }
}

export async function removeCartItem(cartLineId: number) {
  try {
    const res = await authApi.delete(`/api/cart/line/${cartLineId}/`);
    console.log('Removed from Cart:', cartLineId);
    return res.data;
  } catch (error) {
    console.log('Error Removing from Cart:', error);
    throw error;
  }
}

export async function clearCart() {
  try {
    const res = await authApi.delete(`/api/cart/clear/`);
    console.log('Cleared Cart:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Clearing Cart:', error);
    throw error;
  }
}

export async function createOrder() {
  try {
    const res = await authApi.post(`/api/orders/`);
    console.log('Created Order:', res.data);
    return res.data.order;
  } catch (error: any) {
    console.error(
      'Error Creating Order:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function createPayment(
  orderId: number,
  method: 'cod' | 'gcash',
  proofImage?: any,
) {
  try {
    const formData = new FormData();
    formData.append('order', orderId.toString());
    formData.append('method', method);
    if (proofImage) {
      formData.append('proof_image', {
        uri: proofImage.uri,
        name: proofImage.fileName || 'proof.jpg',
        type: proofImage.type || 'image/jpeg',
      });
    }

    const res = await authApi.post(`/api/payments/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Created Payment:', res.data);
    return res.data;
  } catch (error: any) {
    console.error(
      'Error Creating Payment:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

export default api;
