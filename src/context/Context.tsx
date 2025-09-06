import { StyleSheet, Text, View } from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  ReactNode,
} from 'react';

type ContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export const Context = createContext<ContextType | undefined>(undefined);

export default function Provider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const global = { isLoggedIn, setIsLoggedIn };

  return <Context.Provider value={global}>{children}</Context.Provider>;
}
