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
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import AllowLocationScreen from '../components/AllowLocationScreen';
import { StyleSignup } from '../styles/SignupScreen';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../contexts/Context';
import api from '../services/api';

import { API_URL } from '@env';
import axios from 'axios';

const apiEmail = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function SendEmailScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData, setFormData } = context;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pressCount, setPressCount] = useState(0);

  const handleSendEmail = async () => {
    setPressCount(prev => prev + 1);

    if (pressCount + 1 >= 2) {
      setError('');
      navigation.navigate('Login');
      setFormData({ ...formData, email: '' });
      return;
    }

    try {
      console.log(`

          2.) SEND EMAIL VERIFICATION
          
            To: ${formData.email}

        `);

      setLoading(true);
      setError('');

      const response = await apiEmail.post('/email-signup/', {
        email: formData.email,
      });

      console.log(`

          3.) CHECK YOUR INBOX

            Message: ${response.data.message}

        `);

      navigation.navigate('VerifyEmail');
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Network or server error';

      console.log(`

          BACKEND!!!
          
            Message: ${message}

        `);

      setError(message);

      setTimeout(() => {
        setError('');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={StyleSignup.container}>
      <View style={StyleSignup.topButton}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signup');
            setFormData({ ...formData, email: '' });
          }}
        >
          <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
        </TouchableOpacity>
      </View>

      <View style={StyleSignup.midContent2}>
        <Image source={Images.mail} style={StyleSignup.logo2} />

        <Text style={StyleSignup.h2}>
          Verify your email address to get started
        </Text>

        <Text style={StyleSignup.pGrey}>
          This helps us mitigate fraud and keep your personal data safe
        </Text>
      </View>

      <View style={StyleSignup.botButton}>
        <View style={StyleSignup.topShadow} />
        <Pressable
          onPress={handleSendEmail}
          style={({ pressed }) => [
            StyleSignup.continueButton,
            pressed && StyleSignup.buttonPressed,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={StyleSignup.continueText}>
              {error ? error : 'Send Verification Email'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
