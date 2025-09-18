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

  const handleSendEmail = async () => {
    try {
      console.log('sending email');

      setLoading(true);
      setError('');

      const response = await apiEmail.post('/email-signup/', {
        email: formData.email,
      });

      console.log(response.data);

      navigation.navigate('VerifyEmail');
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong';

      console.log('message:', message);

      setError(message);

      setTimeout(() => {
        setError('');

        setFormData({ ...formData, email: '' });

        navigation.navigate('Signup');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={StyleSignup.container}>
      <View style={StyleSignup.topButton}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
