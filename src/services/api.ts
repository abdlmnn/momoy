import axios from 'axios';
import { API_URL } from '@env';

export async function getProducts() {
  try {
    const res = await axios.get(`${API_URL}/products/`);
    console.log('Fetched Products:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Fetching Products:', error);
  }
}

export async function getCategories() {
  try {
    const res = await axios.get(`${API_URL}/categories/`);
    console.log('Fetched Categories:', res.data);
    return res.data;
  } catch (error) {
    console.log('Error Fetching Categories:', error);
  }
}
