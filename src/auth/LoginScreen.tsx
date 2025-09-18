import React from 'react';
import { Text, View } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  User as GoogleUser,
  SignInResponse,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { WEB_CLIENT_ID } from '@env';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true,
  scopes: ['email', 'profile'],
});

export default function LoginScreen({ navigation }: any) {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      const res = await api.post('/auth/google/', { token: idToken });

      console.log('Response:', res.data);

      if (res.data.access) {
        await AsyncStorage.setItem('accessToken', res.data.access);
        await AsyncStorage.setItem('refreshToken', res.data.refresh);

        navigation.replace('Index');
      } else {
        console.log('Login failed:', res.data);
      }
    } catch (error: any) {
      console.log('Sign-In Error:', error.response?.data || error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>LoginScreen</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        disabled={false}
      />
    </View>
  );
}
