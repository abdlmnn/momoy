import React, { useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import SplashScreen from './src/components/SplashScreen';
import Colors from './src/constants/Colors';
import StackNavigator from './src/navigation/StackNavigator';
import Provider from './src/context/Context';

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
    <Provider safeAreaInsets={safeAreaInsets}>
      <StackNavigator />
    </Provider>
  );
}

export default App;
