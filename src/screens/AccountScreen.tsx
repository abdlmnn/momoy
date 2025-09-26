import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useContext } from 'react';
import { Context } from '../contexts/Context';
import Colors from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen({ navigation }: any) {
  const { isLoggedIn, logout } = useContext(Context)!;

  console.log('Auth:', isLoggedIn);

  const handleLogout = async () => {
    try {
      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (e) {
      console.log('Logout failed:', e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.paleYellow,
      }}
    >
      <Text>Accont Screen</Text>

      <Text>You are {isLoggedIn ? '' : 'not'} logged in</Text>

      {isLoggedIn ? (
        <Pressable
          onPress={handleLogout}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: Colors.darkTangerine,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
            Logout
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={
            () =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            // navigation.navigate('Welcome')
          }
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: Colors.darkTangerine,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
            Log In | Sign Up
          </Text>
        </Pressable>
      )}
    </View>
  );
}
