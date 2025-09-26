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

        if (savedAccess) setAccessToken(savedAccess);
        if (savedRefresh) setRefreshToken(savedRefresh);
        if (savedProgress) setFormData(JSON.parse(savedProgress));
        if (createdFlag) setIsCreated(createdFlag === 'true');
      } catch (e) {
        console.log('Failed to load saved tokens:', e);
      }
    };

    loadSavedTokens();
  }, []);

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
  };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
