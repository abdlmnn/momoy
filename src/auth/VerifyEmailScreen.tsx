import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  Image,
  TextInput,
  TextStyle,
  Keyboard,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import AllowLocationScreen from '../components/AllowLocationScreen';
import { StyleSignup } from '../styles/SignupScreen';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../contexts/Context';

import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTokens } from '../services/api';

const apiCheckEmail = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function VerifyEmailScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData, setAccessToken, setRefreshToken } = context;

  const [isVerified, setIsVerified] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const checkVerification = async () => {
      try {
        const response = await apiCheckEmail.get(
          `/check-verification/?email=${formData.email}`,
        );

        const { email, is_verified, access, refresh } = response.data.data;

        if (is_verified) {
          if (isMounted.current) {
            await saveTokens(access, refresh);

            setIsVerified(true);

            setAccessToken(access);
            setRefreshToken(refresh);

            console.log(`

          4.) EMAIL VERIFIED
              
            Email: ${email}
            Is_verified: ${is_verified}
            Access: ${access}
            Refresh: ${refresh}

          `);

            navigation.navigate('CreateAccount');
          }
        } else {
          if (isMounted.current) {
            setTimeout(checkVerification, 5000);
          }
        }
      } catch (error: any) {
        const message = error.response?.data || error.message;

        console.log(`

          BACKEND !!!
          
            Message: ${message}

        `);
      }
    };

    checkVerification();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleProceed = async () => {
    if (isVerified) {
      navigation.navigate('AllowLocation');
    }
  };

  const handleResendEmail = () => {
    navigation.navigate('FormDetails');
  };

  return (
    <View style={StyleSignup.container}>
      <View style={StyleSignup.topButton}>
        <TouchableOpacity onPress={() => navigation.navigate('SendEmail')}>
          <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
        </TouchableOpacity>
      </View>

      <View style={StyleSignup.midContent2}>
        <Image source={Images.mail} style={StyleSignup.logo2} />

        <Text style={StyleSignup.h2}>
          We've sent a verification link to {formData.email}
        </Text>

        <Text style={StyleSignup.pGrey}>
          Please click the verification link in your inbox
        </Text>
      </View>

      <View style={StyleSignup.botButton}>
        <View style={StyleSignup.topShadow} />
        <Pressable
          onPress={handleProceed}
          disabled={!isVerified}
          style={({ pressed }) => [
            StyleSignup.checkInboxButton,
            !isVerified ? { backgroundColor: '#ccc' } : {},
            pressed && StyleSignup.buttonPressed,
          ]}
        >
          <Text style={StyleSignup.continueText}>
            {isVerified ? 'Proceed' : 'Check Inbox'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleResendEmail}
          style={({ pressed }) => [
            StyleSignup.resendLinkButton,
            pressed && StyleSignup.buttonPressed2,
          ]}
        >
          <Text style={StyleSignup.sendText}>Resend Verification Link</Text>
        </Pressable>
      </View>
    </View>
  );
}
