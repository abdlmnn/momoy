import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StyleSignup } from '../styles/SignupScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';

export default function CheckText({ useBullet = false, text }: any) {
  return (
    <View style={StyleSignup.textCheckRow}>
      {useBullet ? (
        <>
          <MaterialIcons
            name="fiber-manual-record"
            size={10}
            color={Colors.charcoal}
            style={{ marginLeft: 5 }}
          />

          <Text style={[StyleSignup.passwordText2, { marginLeft: 7 }]}>
            {text}
          </Text>
        </>
      ) : (
        <>
          <MaterialIcons name="check" size={22} color={Colors.charcoal} />

          <Text style={StyleSignup.passwordText2}>{text}</Text>
        </>
      )}
    </View>
  );
}
