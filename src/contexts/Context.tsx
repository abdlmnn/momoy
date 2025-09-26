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

type formData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  usePassword: boolean;
};

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
};

export const Context = createContext<ContextType | undefined>(undefined);

export default function Provider({ children }: any) {
  const [isCreated, setIsCreated] = useState(false);

  const [formData, setFormData] = useState<formData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    usePassword: true,
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const isLoggedIn = !!accessToken && !!refreshToken;

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

    setFormData({ ...formData, email: '' });

    await AsyncStorage.multiRemove([
      'access',
      'refresh',
      'userLocation',
      'accountProgress',
      'isCreated',
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
  };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
