import React, { useState, useEffect, useRef, useContext } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Animated,
  Image,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import SplashScreen from './src/components/SplashScreen';
import Colors from './src/constants/Colors';
import StackNavigator from './src/navigation/StackNavigator';
import Provider, { Context } from './src/contexts/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Images from './src/constants/Images';
import { isExpired } from './src/services/expiredToken';

function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  const [initialRoute, setInitialRoute] = useState<null | string>(null);

  const { logout } = useContext(Context)!;

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const refresh = await AsyncStorage.getItem('refresh');

        const createdFlag = await AsyncStorage.getItem('isCreated');

        const isCreated = createdFlag === 'true';

        if (refresh && !isExpired(refresh)) {
          setInitialRoute(!isCreated ? 'CreateAccount' : 'Index');
        } else {
          if (logout) await logout();

          setInitialRoute('Welcome');
        }
      } catch (e) {
        console.log('Error checking progress:', e);

        setInitialRoute('Welcome');
      } finally {
        setIsLoading(false);
      }
    };

    checkProgress();
  }, [logout]);

  return isLoading ? (
    <SplashScreen onFinish={() => setIsLoading(false)} />
  ) : (
    <>
      <StackNavigator initialRouteName={initialRoute} />
      {changeNavigationBarColor(Colors.white, true)}
    </>
  );
}

export default App;
