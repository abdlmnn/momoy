import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { Context } from '../context/Context';

export default function CartScreen({ navigation }: any) {
  const { isLoggedIn } = useContext(Context)!;
  console.log('Auth:', isLoggedIn);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}
    >
      <Text>CartScreen</Text>
      <Text>You are {isLoggedIn ? '' : 'not'} logged in</Text>
    </View>
  );
}
