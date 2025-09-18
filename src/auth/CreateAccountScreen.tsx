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
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import axios from 'axios';
import { API_URL } from '@env';
import { apiAuth } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateAccountScreen({ navigation }: any) {
  const context = useContext(Context)!;

  const { formData, setFormData, accessToken } = context;

  const [submitted, setSubmitted] = useState(false);

  const isFirstNameValid = formData.firstName.trim().length > 0;
  const isLastNameValid = formData.lastName.trim().length > 0;
  const isPhoneValid = /^\d{10}$/.test(formData.phone.replace(/\s/g, ''));
  const isValid = isFirstNameValid && isLastNameValid && isPhoneValid;

  const handleCreateAccount = async () => {
    setSubmitted(true);

    if (isValid) {
      try {
        const token = accessToken;

        if (!token) {
          console.log('No token found');
          return;
        }

        const response = await apiAuth(token).post('/create-account/', {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone.replace(/\s/g, ''),
        });

        console.log(`

          FINISH LINE!!!

            Message: ${response.data.message}
            Fullname: ${response.data.first_name} ${response.data.last_name}
            Phone: ${response.data.phone}
            Email: ${response.data.email}

        `);

        navigation.navigate('AllowLocation');
      } catch (err: any) {
        console.log(
          'Error creating account:',
          err.response?.data || err.message,
        );
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={StyleSignup.container}>
        <View style={StyleSignup.topButton}>
          <TouchableOpacity onPress={() => navigation.navigate('VerifyEmail')}>
            <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
          </TouchableOpacity>
        </View>

        <View style={StyleSignup.midContent}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
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
              }}
            >
              <View style={{ flex: 0 }}>
                <Inputs
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, firstName: text }))
                  }
                  submitted={submitted}
                  isValid={isFirstNameValid}
                />
              </View>

              <View style={{ flex: 0, marginTop: 10 }}>
                <Inputs
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={text =>
                    setFormData(prev => ({ ...prev, lastName: text }))
                  }
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
                    label="Phone Number"
                    value={formData.phone}
                    onChangeText={text =>
                      setFormData(prev => ({
                        ...prev,
                        phone: formatPhoneNumber(text),
                      }))
                    }
                    submitted={submitted}
                    isValid={isPhoneValid}
                    keyboardType="phone-pad"
                  />
                </View>
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
