import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}
