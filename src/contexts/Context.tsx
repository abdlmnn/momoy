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

  // console.log('Signup FormData: ', formData);

  const global: ContextType = {
    isLoggedIn,
    setIsLoggedIn,

    Colors,
    Images,

    formData,
    setFormData,
  };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
