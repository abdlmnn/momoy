import { StyleSheet, Text, View } from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  ReactNode,
} from 'react';
import Colors from '../constants/Colors';
import Images from '../constants/Images';

type ContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;

  Colors: typeof Colors;
  Images: typeof Images;
};

export const Context = createContext<ContextType | undefined>(undefined);

export default function Provider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const global = { isLoggedIn, setIsLoggedIn, Colors, Images };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
