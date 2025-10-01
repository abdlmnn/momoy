import {
  Image,
  Keyboard,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import Inputs, { Prefix } from '../components/common/Inputs';
import { Context } from '../contexts/Context';
import { StyleSignup } from '../styles/SignupScreen';
import CheckText from '../components/CheckText';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import axios from 'axios';
import { API_URL } from '@env';
import { apiAuth } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CheckBox from '@react-native-community/checkbox';

const apiLogin = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: { 'Content-Type': 'application/json' },
});

export default function LoginScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData, setFormData, setAccessToken, setRefreshToken } = context;

  const [submitted, setSubmitted] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);

  const [errorEmail, setErrorEmail] = useState('Email');
  const [errorPassword, setErrorPassword] = useState('Password');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);
  const isPasswordValid = formData.password.trim().length >= 8;
  const isValid = isEmailValid && isPasswordValid;

  useEffect(() => {
    setFormData(prev => ({ ...prev, email: '', password: '' }));
  }, []);

  const handleLoginPassword = async () => {
    setSubmitted(true);

    let hasError = false;

    if (formData.email === '') {
      setErrorEmail('Email is required');
      hasError = true;
    } else if (!isEmailValid) {
      setErrorEmail('Enter a valid email');
      hasError = true;
    } else {
      setErrorEmail('Email');
    }

    if (formData.password === '') {
      setErrorPassword('Password is required');
      hasError = true;
    } else if (!isPasswordValid) {
      setErrorPassword('Password must be at least 8 characters');
      hasError = true;
    } else {
      setErrorPassword('Password');
    }

    if (hasError) return;

    setLoadingLogin(true);

    try {
      const response = await apiLogin.post('/login/', {
        email: formData.email,
        password: formData.password,
      });

      console.log(`

          Logged In!!!

            Message: ${response.data.message}
            Fullname: ${response.data.first_name} ${response.data.last_name}
            Email: ${response.data.email}
            Access: ${response.data.access}
            Refresh: ${response.data.refresh}

        `);

      await AsyncStorage.setItem('access', response.data.access);
      await AsyncStorage.setItem('refresh', response.data.refresh);
      await AsyncStorage.setItem('isCreated', 'true');

      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);

      navigation.navigate('Index');
    } catch (err: any) {
      console.log(
        'Error logging in:',
        err.response?.data?.error || err.message,
      );

      const errorMsg: string = err.response?.data?.error || 'Login failed';

      setErrorEmail('Email');
      setErrorPassword('Password');

      if (errorMsg.toLowerCase().includes('email')) {
        setErrorEmail(errorMsg);
        // setFormData(prev => ({ ...prev, email: '' }));
        // setFormData(prev => ({ ...prev, password: '' }));
      } else if (errorMsg.toLowerCase().includes('password')) {
        setErrorPassword(errorMsg);
        // setFormData(prev => ({ ...prev, password: '' }));
      } else if (errorMsg.toLowerCase().includes('not verified')) {
        setErrorEmail(errorMsg);
      } else {
        setErrorEmail(errorMsg);
        setErrorPassword(errorMsg);
      }
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={StyleSignup.container}>
        <View
          style={[
            StyleSignup.topButton,
            // { borderWidth: 0, paddingVertical: 32 },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
          </TouchableOpacity>
        </View>

        <View style={StyleSignup.midContent}>
          <ScrollView
            contentContainerStyle={{
              // flexGrow: 1,
              paddingBottom: 25,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={Images.login}
              style={[StyleSignup.logo, { marginBottom: 15 }]}
            />

            <Text style={StyleSignup.h1}>Log in to your account</Text>

            <Text style={[StyleSignup.p, { marginTop: 15 }]}>
              Log in with password or get a login link via email.
            </Text>

            <View
              style={{
                // flexDirection: 'row',
                gap: 12,
                marginTop: 25,
                flex: 1,
                // borderWidth: 1,
              }}
            >
              <View style={{ flex: 0 }}>
                <Inputs
                  bgColor={Colors.white}
                  label="Email"
                  error={errorEmail}
                  value={formData.email}
                  onChangeText={text => {
                    const updated = { ...formData, email: text };
                    setFormData(updated);
                    if (submitted) {
                      setSubmitted(false);
                    }

                    setErrorEmail('Email');
                  }}
                  submitted={submitted}
                  isValid={isEmailValid}
                />
              </View>

              <View style={{ flex: 0, marginTop: 10 }}>
                <Inputs
                  bgColor={Colors.white}
                  label="Password"
                  error={errorPassword}
                  value={formData.password}
                  onChangeText={text => {
                    const updated = {
                      ...formData,
                      password: text,
                    };
                    setFormData(updated);
                    if (submitted) {
                      setSubmitted(false);
                    }

                    setErrorPassword('Password');
                  }}
                  submitted={submitted}
                  isValid={isPasswordValid}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={StyleSignup.botButton}>
          <View style={StyleSignup.topShadow} />
          <Pressable
            onPress={handleLoginPassword}
            disabled={!isValid || loadingLogin}
            style={({ pressed }) => [
              StyleSignup.checkInboxButton,
              {
                backgroundColor: isValid ? Colors.darkTangerine : Colors.gray,
              },
              pressed && StyleSignup.buttonPressed,
            ]}
          >
            {loadingLogin ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={StyleSignup.continueText}>Log in with password</Text>
            )}
          </Pressable>

          <Pressable
            // onPress={handleResendEmail}
            disabled={!isEmailValid || loadingLink}
            style={({ pressed }) => [
              StyleSignup.resendLinkButton,
              {
                borderColor: isEmailValid ? Colors.charcoal : Colors.gray,
              },
              pressed && StyleSignup.buttonPressed2,
            ]}
          >
            {loadingLink ? (
              <ActivityIndicator size="small" color={Colors.charcoal} />
            ) : (
              <Text
                style={[
                  StyleSignup.sendText,
                  { color: isEmailValid ? Colors.charcoal : Colors.gray },
                ]}
              >
                Send me a login link
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// const formatPhoneNumber = (text: string) => {
//   let cleaned = text.replace(/\D/g, '');

//   cleaned = cleaned.slice(0, 10);

//   const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

//   if (!match) return text;

//   return [match[1], match[2], match[3]].filter(Boolean).join(' ');
// };

// import React from 'react';
// import { Text, View } from 'react-native';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   User as GoogleUser,
//   SignInResponse,
// } from '@react-native-google-signin/google-signin';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../services/api';
// import { WEB_CLIENT_ID } from '@env';

// GoogleSignin.configure({
//   webClientId: WEB_CLIENT_ID,
//   offlineAccess: true,
//   scopes: ['email', 'profile'],
// });

// import { API_URL } from '@env';
// import axios from 'axios';

// const apiGoogle = axios.create({
//   baseURL: `${API_URL}/auth`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default function LoginScreen({ navigation }: any) {
//   const signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices({
//         showPlayServicesUpdateDialog: true,
//       });

//       await GoogleSignin.signOut();

//       const userInfo = await GoogleSignin.signIn();

//       const idToken = userInfo.data?.idToken;

//       const res = await apiGoogle.post('/google/', { token: idToken });

//       console.log('Response:', res.data);

//       if (res.data.access) {
//         await AsyncStorage.setItem('accessToken', res.data.access);
//         await AsyncStorage.setItem('refreshToken', res.data.refresh);

//         navigation.replace('Index');
//       } else {
//         console.log('Login failed:', res.data);
//       }
//     } catch (error: any) {
//       console.log('Sign-In Error:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ marginBottom: 20 }}>LoginScreen</Text>
//       {/* <GoogleSigninButton
//         size={GoogleSigninButton.Size.Wide}
//         color={GoogleSigninButton.Color.Dark}
//         onPress={signIn}
//         disabled={false}
//       /> */}
//     </View>
//   );
// }
