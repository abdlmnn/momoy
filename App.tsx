import React, { useState, useEffect } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import SplashScreen from './src/components/SplashScreen';
import Colors from './src/constants/Colors';
import StackNavigator from './src/navigation/StackNavigator';
import Provider from './src/contexts/Context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

function App() {
  return (
    <SafeAreaProvider
      style={{ backgroundColor: Colors.lightTangerine, flex: 1 }}
    >
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);

  const [initialRoute, setInitialRoute] = useState<null | string>(null);

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const access = await AsyncStorage.getItem('access');
        const refresh = await AsyncStorage.getItem('refresh');

        const createdFlag = await AsyncStorage.getItem('isCreated');

        // console.log('Access:', access, 'Refresh:', refresh);

        const isCreated = createdFlag === 'true';

        if (access && refresh) {
          setInitialRoute(!isCreated ? 'CreateAccount' : 'Index');
        } else {
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

    changeNavigationBarColor(Colors.white, true);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider
        style={{ flex: 1, backgroundColor: Colors.lightTangerine }}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.lightTangerine}
        />

        <View style={{ flex: 1, backgroundColor: Colors.lightTangerine }}>
          <SplashScreen onFinish={() => setIsLoading(false)} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <Provider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <StackNavigator initialRouteName={initialRoute} />
    </Provider>
  );
}

export default App;
