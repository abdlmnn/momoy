import { StyleSheet, Text, View } from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  ReactNode,
  use,
} from 'react';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isExpired } from '../services/expiredToken';

import {
  getProducts,
  getCategories,
  getInventory,
  getUserAddress,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../services/api';

type formData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  password: string;
  usePassword: boolean;
};

type Product = any;
type Category = any;
type Inventory = any;
type CartItem = any;

type ContextType = {
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;

  Colors: typeof Colors;
  Images: typeof Images;

  accessToken: string | null;
  setAccessToken: (token: string | null) => void;

  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;

  isLoggedIn: boolean;

  isCreated: boolean;
  setIsCreated: (value: boolean) => void;

  userLocation: { latitude: number; longitude: number } | null;

  setLocation: (
    loc: { latitude: number; longitude: number } | null,
  ) => Promise<void>;

  logout: () => void;

  products: Product[];
  categories: Category[];
  inventories: Inventory[];
  loadingData: boolean;
  refreshData: () => Promise<void>;

  cart: CartItem[];
  loadingCart: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (inventoryId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const initialFormData = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  password: '',
  usePassword: true,
};

export const Context = createContext<ContextType | undefined>(undefined);

export default function Provider({ children }: any) {
  const [isCreated, setIsCreated] = useState(false);

  const [formData, setFormData] = useState<formData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    password: '',
    usePassword: true,
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const isLoggedIn =
    !!accessToken && !!refreshToken && !isExpired(refreshToken);

  const refreshData = async () => {
    try {
      setLoadingData(true);
      const [prodData, catData, invData] = await Promise.all([
        getProducts(),
        getCategories(),
        getInventory(),
      ]);

      setProducts(prodData);
      setCategories(catData);
      setInventories(invData);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchCart = async () => {
    if (!accessToken) return;
    try {
      setLoadingCart(true);
      const cartData = await getCart();
      setCart(cartData?.lines || []);
    } catch (error) {
      console.log('Error fetching cart:', error);
    } finally {
      setLoadingCart(false);
    }
  };

  const handleAddToCart = async (inventoryId: number, quantity = 1) => {
    if (!accessToken) return;
    try {
      await addToCart(inventoryId, quantity);
      await fetchCart();
    } catch (error) {
      console.log('Error adding to cart:', error);
    }
  };

  const handleUpdateCartItem = async (itemId: number, quantity: number) => {
    if (!accessToken) return;

    setCart(prevCart =>
      prevCart.map(item => (item.id === itemId ? { ...item, quantity } : item)),
    );

    try {
      await updateCartItem(itemId, quantity);
      // await fetchCart();
    } catch (error) {
      console.log('Error updating cart item:', error);
      fetchCart();
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    if (!accessToken) return;

    setCart(prevCart => prevCart.filter(item => item.id !== itemId));

    try {
      await removeCartItem(itemId);
      // await fetchCart();
    } catch (error) {
      console.log('Error removing item from cart:', error);
      fetchCart();
    }
  };

  const handleClearCart = async () => {
    setCart([]);
    try {
      await clearCart();
    } catch (error) {
      console.log('Error clearing cart:', error);
      fetchCart();
    }
  };

  useEffect(() => {
    const loadSavedTokens = async () => {
      try {
        const savedAccess = await AsyncStorage.getItem('access');
        const savedRefresh = await AsyncStorage.getItem('refresh');
        const savedProgress = await AsyncStorage.getItem('accountProgress');
        const createdFlag = await AsyncStorage.getItem('isCreated');
        const savedLocation = await AsyncStorage.getItem('userLocation');

        if (savedAccess) setAccessToken(savedAccess);
        if (savedRefresh) setRefreshToken(savedRefresh);
        if (savedProgress) setFormData(JSON.parse(savedProgress));
        if (createdFlag) setIsCreated(createdFlag === 'true');
        if (savedLocation) setUserLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.log('Failed to load saved tokens:', e);
      }
    };

    loadSavedTokens();
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchCart();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) refreshData();
  }, [isLoggedIn]);

  const setLocation = async (
    loc: { latitude: number; longitude: number } | null,
  ) => {
    setUserLocation(loc);
    if (loc) await AsyncStorage.setItem('userLocation', JSON.stringify(loc));
    else await AsyncStorage.removeItem('userLocation');
  };

  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserLocation(null);
    // setFormData(initialFormData);
    setIsCreated(false);

    await AsyncStorage.multiRemove([
      'access',
      'refresh',
      'accountProgress',
      'isCreated',
      'userLocation',
    ]);
  };

  const global: ContextType = {
    Colors,
    Images,

    formData,
    setFormData,

    accessToken,
    setAccessToken,

    refreshToken,
    setRefreshToken,

    isLoggedIn,

    isCreated,
    setIsCreated,

    userLocation,
    setLocation,

    logout,

    products,
    categories,
    inventories,
    loadingData,
    refreshData,

    cart,
    loadingCart,
    fetchCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
  };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
