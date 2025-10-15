import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
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
import { Context } from '../contexts/Context';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { cart = [], isLoggedIn } = useContext(Context) || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // backgroundColor: Colors.white,
          height: 60,
          // borderTopWidth: 1,
          // borderTopColor: Colors.light,
          elevation: 5,
        },
        tabBarActiveTintColor: Colors.darkTangerine,
        // tabBarInactiveTintColor: Colors.gray,
        tabBarInactiveTintColor: Colors.grayBar,
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
          lazy: true,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="home"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.grayBar}
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
            // <Feather
            //   name="shopping-bag"
            //   size={22}
            //   color={focused ? Colors.darkTangerine : Colors.grayBar}
            // />
            <>
              <Feather
                name="shopping-bag"
                size={22}
                color={focused ? Colors.darkTangerine : Colors.grayBar}
              />
              {cart.length > 0 && isLoggedIn && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: Colors.red,
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: '700',
                    }}
                  >
                    {cart.length > 99 ? '99+' : cart.length}
                  </Text>
                </View>
              )}
            </>
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
              color={focused ? Colors.darkTangerine : Colors.grayBar}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Notification"
        component={MapScreen}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="notification"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.gray}
            />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, size }) => (
            <Feather
              name="user"
              size={22}
              color={focused ? Colors.darkTangerine : Colors.grayBar}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
