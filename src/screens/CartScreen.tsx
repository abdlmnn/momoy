import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { Context } from '../contexts/Context';
import Colors from '../constants/Colors';

export default function CartScreen({ navigation }: any) {
  const { isLoggedIn } = useContext(Context)!;
  // console.log('Auth:', isLoggedIn);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.paleYellow,
      }}
    >
      <Text>CartScreen</Text>
      <Text>You are {isLoggedIn ? '' : 'not'} logged in</Text>
    </View>
  );
}
