import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { StyleSignup } from '../styles/SignupScreen';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../contexts/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function VerifyLoginLinkScreen({ navigation }: any) {
  const context = useContext(Context)!;
  const { formData, setAccessToken, setRefreshToken, setFormData } = context;

  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await api.get(
          `/auth/check-verification-status/?email=${formData.email}`,
        );

        if (response.data.verified) {
          const { access, refresh, email } = response.data;

          await AsyncStorage.setItem('access', access);
          await AsyncStorage.setItem('refresh', refresh);
          await AsyncStorage.setItem('isCreated', 'true');

          setAccessToken(access);
          setRefreshToken(refresh);
          setIsVerified(true);

          if (intervalRef.current) clearInterval(intervalRef.current);
          if (timerRef.current) clearInterval(timerRef.current);

          navigation.reset({
            index: 0,
            routes: [{ name: 'Index' }],
          });

          console.log(`Login verified: ${email}`);
        }
      } catch (error: any) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;

        console.log(`

          BACKEND !!!
          
            Message: ${message}

        `);
      }
    };

    intervalRef.current = setInterval(checkVerification, 5000);
    checkVerification();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVerified) return;

    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isVerified]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      password: '',
    }));
  }, []);

  const handleResend = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={StyleSignup.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={StyleSignup.topButton}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          }
        >
          <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
        </TouchableOpacity>
      </View>

      <View style={StyleSignup.midContent2}>
        <Image source={Images.mail} style={StyleSignup.logo2} />

        <Text style={StyleSignup.h2}>
          We've sent a login link to {formData.email}
        </Text>

        <Text style={StyleSignup.pGrey}>
          Please click the link in your email. This link expires in{' '}
          <Text style={{ fontWeight: '600', color: Colors.charcoal }}>
            {/* {timeLeft}s */}
            60s
          </Text>
          .
        </Text>

        {isVerified && (
          <Text
            style={[
              StyleSignup.pGrey,
              { color: Colors.darkTangerine, marginTop: 12 },
            ]}
          >
            Verified! Redirecting…
          </Text>
        )}
      </View>

      <View style={StyleSignup.botButton}>
        <View style={StyleSignup.topShadow} />

        <Pressable
          onPress={() => navigation.navigate('Login')}
          disabled={!isVerified}
          style={({ pressed }) => [
            StyleSignup.checkInboxButton,
            { marginBottom: 12 },
            !isVerified
              ? { backgroundColor: '#ccc' }
              : { backgroundColor: Colors.darkTangerine },
            pressed && StyleSignup.buttonPressed,
          ]}
        >
          <Text style={StyleSignup.continueText}>
            {isVerified ? 'Proceed' : 'Check your inbox'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleResend}
          disabled={timeLeft > 0 || isVerified}
          style={({ pressed }) => [
            StyleSignup.resendLinkButton,
            pressed && StyleSignup.buttonPressed2,
          ]}
        >
          <Text style={StyleSignup.sendText}>
            {isVerified
              ? 'Verified! Redirecting…'
              : timeLeft > 0
              ? `Resend in ${timeLeft} seconds`
              : 'Resend Login Link'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
