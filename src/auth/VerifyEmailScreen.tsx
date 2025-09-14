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

export default function VerifyEmailScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData } = context;

  const handleCheckInbox = () => {
    const mailtoUrl = `mailto:${formData.email}`;

    try {
      Linking.openURL(mailtoUrl);
    } catch (error) {
      console.log('No Email App', error);
    }
  };

  const handleResendEmail = () => {
    navigation.navigate('AllowLocation');
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
          onPress={handleCheckInbox}
          style={({ pressed }) => [
            StyleSignup.checkInboxButton,
            pressed && StyleSignup.buttonPressed,
          ]}
        >
          <Text style={StyleSignup.continueText}>Check Inbox</Text>
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
