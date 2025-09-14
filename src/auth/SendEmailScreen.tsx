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
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
import AllowLocationScreen from '../components/AllowLocationScreen';
import { StyleSignup } from '../styles/SignupScreen';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../contexts/Context';

export default function SendEmailScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData } = context;

  const handleSendEmail = () => {
    navigation.navigate('VerifyEmail');
    console.log('sending email');
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
          <Text style={StyleSignup.continueText}>Send Verification Email</Text>
        </Pressable>
      </View>
    </View>
  );
}
