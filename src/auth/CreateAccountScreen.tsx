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

export default function CreateAccountScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData, setFormData, accessToken, setIsCreated } = context;

  const [submitted, setSubmitted] = useState(false);

  const [errorText, setErrorText] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });

  const isFirstNameValid = formData.firstName.trim().length > 0;
  const isLastNameValid = formData.lastName.trim().length > 0;
  const isPhoneValid = /^\d{10}$/.test(formData.phone.replace(/\s/g, ''));
  const isPasswordValid = formData.usePassword
    ? true
    : formData.password.trim().length >= 8;
  const isValid =
    isFirstNameValid && isLastNameValid && isPhoneValid && isPasswordValid;

  const saveProgress = async (data: any) => {
    try {
      await AsyncStorage.setItem('accountProgress', JSON.stringify(data));
    } catch (e) {
      console.log('Error saving progress', e);
    }
  };

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem('accountProgress');
        if (stored) {
          setFormData(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error loading progress', e);
      }
    };
    loadProgress();
  }, []);

  const getApiInstance = async () => {
    let accessToken = await AsyncStorage.getItem('access');

    const instance = axios.create({
      baseURL: `${API_URL}/auth`,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    instance.interceptors.response.use(
      response => response,
      async error => {
        if (
          error.response?.status === 401 &&
          error.response?.data?.code === 'token_not_valid'
        ) {
          const refreshToken = await AsyncStorage.getItem('refresh');
          if (!refreshToken) return Promise.reject(error);

          try {
            const refreshResp = await axios.post(
              `${API_URL}/auth/token/refresh/`,
              {
                refresh: refreshToken,
              },
            );

            const newAccess = refreshResp.data.access;
            await AsyncStorage.setItem('access', newAccess);

            error.config.headers['Authorization'] = `Bearer ${newAccess}`;
            return instance(error.config);
          } catch (refreshErr) {
            console.log('Refresh token failed', refreshErr);

            navigation.navigate('Welcome');
            return Promise.reject(refreshErr);
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  };

  const handleCreateAccount = async () => {
    setSubmitted(true);

    let errors: any = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      password: 'Password',
    };

    let hasError = false;

    if (formData.firstName.trim() === '') {
      errors.firstName = 'First Name is required';
      hasError = true;
    }

    if (formData.lastName.trim() === '') {
      errors.lastName = 'Last Name is required';
      hasError = true;
    }

    if (formData.phone.replace(/\s/g, '').length === 0) {
      errors.phone = 'Phone number is required';
      hasError = true;
    } else if (!isPhoneValid) {
      errors.phone = 'Enter a valid 10-digit phone number';
      hasError = true;
    }

    if (!formData.usePassword) {
      if (formData.password.trim() === '') {
        errors.password = 'Password is required';
        hasError = true;
      } else if (!isPasswordValid) {
        errors.password = 'Password must be at least 8 characters';
        hasError = true;
      }
    }

    setErrorText(errors);

    if (hasError) return;

    try {
      const token = accessToken;

      const api = await getApiInstance();

      const response = await api.post('/create-account/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone.replace(/\s/g, ''),
        password: formData.usePassword ? undefined : formData.password,
      });

      console.log(`

          5.) Created Account

            Fullname: ${response.data.first_name} ${response.data.last_name}
            Phone: ${response.data.phone}
            Email: ${response.data.email}
            Password: ${response.data.password}

        `);

      navigation.navigate('AllowLocation');
    } catch (err: any) {
      console.log(
        'Error creating account:',
        err.response?.data.messages.message || err.message,
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={StyleSignup.container}>
        <View
          style={[
            StyleSignup.topButton,
            { borderWidth: 0, paddingVertical: 32 },
          ]}
        >
          {/* <TouchableOpacity onPress={() => navigation.reset('VerifyEmail')}>
            <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
          </TouchableOpacity> */}
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
              source={Images.profile}
              style={[StyleSignup.logo, { marginBottom: 15 }]}
            />

            <Text style={StyleSignup.h1}>Let's get you started!</Text>

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
                  label="First Name"
                  error={errorText.firstName}
                  value={formData.firstName}
                  onChangeText={text => {
                    const updated = { ...formData, firstName: text };
                    setFormData(updated);
                    saveProgress(updated);

                    if (submitted) setSubmitted(false);

                    setErrorText(prev => ({
                      ...prev,
                      firstName: 'First Name',
                    }));
                  }}
                  submitted={submitted}
                  isValid={isFirstNameValid}
                />
              </View>

              <View style={{ flex: 0, marginTop: 10 }}>
                <Inputs
                  bgColor={Colors.white}
                  label="Last Name"
                  error={errorText.lastName}
                  value={formData.lastName}
                  onChangeText={text => {
                    const updated = { ...formData, lastName: text };
                    setFormData(updated);
                    saveProgress(updated);

                    if (submitted) setSubmitted(false);

                    setErrorText(prev => ({ ...prev, lastName: 'Last Name' }));
                  }}
                  submitted={submitted}
                  isValid={isLastNameValid}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <Prefix />

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Inputs
                    bgColor={Colors.white}
                    label="Phone Number"
                    error={errorText.phone}
                    value={formData.phone}
                    onChangeText={text => {
                      const updated = {
                        ...formData,
                        phone: formatPhoneNumber(text),
                      };
                      setFormData(updated);
                      saveProgress(updated);

                      if (submitted) setSubmitted(false);
                      setErrorText(prev => ({
                        ...prev,
                        phone: 'Phone Number',
                      }));
                    }}
                    submitted={submitted}
                    isValid={isPhoneValid}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {!formData.usePassword && (
                <View style={{ flex: 0, marginTop: 10 }}>
                  <Inputs
                    bgColor={Colors.white}
                    label="Password"
                    error={errorText.password}
                    value={formData.password}
                    onChangeText={text => {
                      const updated = {
                        ...formData,
                        password: text,
                      };
                      setFormData(updated);
                      saveProgress(updated);

                      if (submitted) setSubmitted(false);
                      setErrorText(prev => ({ ...prev, password: 'Password' }));
                    }}
                    submitted={submitted}
                    isValid={isPasswordValid}
                  />
                </View>
              )}

              <View style={StyleSignup.passwordContainer}>
                <View style={StyleSignup.checkContainer}>
                  <CheckBox
                    value={formData.usePassword}
                    onValueChange={value => {
                      const updated = {
                        ...formData,
                        usePassword: value,
                        password: value ? '' : formData.password,
                      };
                      setFormData(updated);
                      saveProgress(updated);
                    }}
                    tintColors={{
                      true: Colors.charcoal,
                      false: Colors.charcoal,
                    }}
                  />

                  <Text style={StyleSignup.passwordText}>
                    Continue without a password
                  </Text>
                </View>

                {formData.usePassword ? (
                  <View style={StyleSignup.textCheckContainer}>
                    <CheckText text="No need to remember your password" />
                    <CheckText text="Log in using your email" />
                    <CheckText text="Fast, reliable & secure experience every time" />
                  </View>
                ) : (
                  <View style={StyleSignup.textCheckContainer}>
                    <CheckText useBullet text="At least 8 characters" />
                    <CheckText useBullet text="Letters & numbers" />
                    <CheckText useBullet text="Optional symbol" />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={StyleSignup.botButton}>
          <View style={StyleSignup.topShadow} />
          <Pressable
            onPress={handleCreateAccount}
            style={({ pressed }) => [
              StyleSignup.continueButton,
              {
                backgroundColor: isValid ? Colors.darkTangerine : Colors.gray,
              },
              pressed && StyleSignup.buttonPressed,
            ]}
            disabled={!isValid}
          >
            <Text style={StyleSignup.continueText}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const formatPhoneNumber = (text: string) => {
  let cleaned = text.replace(/\D/g, '');

  cleaned = cleaned.slice(0, 10);

  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return text;

  return [match[1], match[2], match[3]].filter(Boolean).join(' ');
};
