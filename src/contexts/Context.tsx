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

import { getProducts } from '../services/api';
import { getCategories } from '../services/api';
import { getInventory } from '../services/api';

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
  };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
