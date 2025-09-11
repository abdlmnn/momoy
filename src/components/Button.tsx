import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { signupStyles, loginStyles, guestStyles } from '../styles/Buttons';

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
