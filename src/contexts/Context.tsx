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

type formData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
};

type ContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;

  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;

  Colors: typeof Colors;
  Images: typeof Images;

  accessToken: string | null;
  setAccessToken: (token: string | null) => void;

  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
};

export const Context = createContext<ContextType | undefined>(undefined);

export default function Provider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState<formData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const global: ContextType = {
    isLoggedIn,
    setIsLoggedIn,

    Colors,
    Images,

    formData,
    setFormData,

    accessToken,
    setAccessToken,

    refreshToken,
    setRefreshToken,
  };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
