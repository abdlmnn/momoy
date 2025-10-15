import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../auth/LoginScreen';
import SignupScreen from '../auth/SignupScreen';
import TabNavigator from '../navigation/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Context } from '../contexts/Context';
import SendEmailScreen from '../auth/SendEmailScreen';
import VerifyEmailScreen from '../auth/VerifyEmailScreen';
import AllowLocationScreen from '../components/AllowLocationScreen';
import CreateAccountScreen from '../auth/CreateAccountScreen';
import GeocodeTest from '../components/TestGeoCode';
import MapScreen from '../screens/MapScreen';
import VerifyLoginLinkScreen from '../auth/VerifyLoginLinkScreen';
import CheckOutScreen from '../screens/CheckOutScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator({ initialRouteName }: any) {
  const { isLoggedIn } = useContext(Context)!;
  console.log('is logged in:', isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="SendEmail" component={SendEmailScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />

        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />

        <Stack.Screen name="AllowLocation" component={AllowLocationScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VerifyLogin" component={VerifyLoginLinkScreen} />

        <Stack.Screen name="Index" component={TabNavigator} />

        <Stack.Screen name="CheckOut" component={CheckOutScreen} />

        <Stack.Screen name="Map" component={MapScreen} />

        <Stack.Screen name="Test" component={GeocodeTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
