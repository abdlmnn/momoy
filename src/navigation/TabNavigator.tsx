import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Lucide from 'react-native-vector-icons/Lucide';

import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';
import MapScreen from '../screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          height: 60,
          // borderTopWidth: 1,
          // borderTopColor: Colors.light,
          elevation: 5,
        },
        tabBarActiveTintColor: Colors.darkTangerine,
        // tabBarInactiveTintColor: Colors.gray,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontSize: 10,
          textAlign: 'center',
          // marginTop: 3,
        },
        tabBarIconStyle: { marginTop: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="home"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.gray}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="shopping-bag"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.gray}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="search"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.gray}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="map"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.gray}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="user"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.gray}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
