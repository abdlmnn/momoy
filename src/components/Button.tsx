import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

export function SignupButton({ onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        signupStyles.signUpButton,
        pressed && signupStyles.buttonPressed,
      ]}
    >
      <Text style={signupStyles.buttonText}>Sign Up</Text>
    </Pressable>
  );
}

export function LoginButton({ onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        loginStyles.loginButton,
        pressed && loginStyles.buttonPressed,
      ]}
    >
      <Text style={loginStyles.buttonText}>Log In</Text>
    </Pressable>
  );
}

export function GuestButton({ onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        guestStyles.guestButton,
        pressed && guestStyles.buttonPressed,
      ]}
    >
      <Text style={guestStyles.buttonText}>Continue as Guest</Text>
    </Pressable>
  );
}

const signupStyles = StyleSheet.create({
  signUpButton: {
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: Colors.light,
  },
  buttonText: {
    color: Colors.mediumGray,
    fontSize: 14,
    fontWeight: '700',
  },
});

const loginStyles = StyleSheet.create({
  loginButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: Colors.lightTangerine,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

const guestStyles = StyleSheet.create({
  guestButton: {
    borderWidth: 1,
    borderColor: Colors.charcoal,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {},
  buttonPressed: {
    backgroundColor: Colors.light,
  },
  buttonText: {
    color: Colors.charcoal,
    fontSize: 14,
    fontWeight: '700',
  },
});
