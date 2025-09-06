import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../auth/LoginScreen';
import TabNavigator from '../navigation/TabNavigator';
import { Context } from '../context/Context';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isLoggedIn } = useContext(Context);
  console.log('Stack:', isLoggedIn);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Index" component={TabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Index" component={TabNavigator} />
            {/* Review Payment and Address */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
