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
  StatusBar,
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import React, { useEffect, useRef, useState, useContext } from 'react';
import AllowLocationScreen from '../components/AllowLocationScreen';
import { StyleSignup } from '../styles/SignupScreen';
import Images from '../constants/Images';
import Colors from '../constants/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../contexts/Context';

export default function SignupScreen({ navigation }: any) {
  const context = useContext(Context)!;
  const { formData, setFormData } = context;

  const [isFocused, setIsFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const labelAnim = useRef(new Animated.Value(formData.email ? 1 : 0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    // StatusBar.setBackgroundColor(Colors.white);

    changeNavigationBarColor(Colors.white, true);
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, email: '' }));
  }, []);

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || formData.email ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, formData.email]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(formData.email);

  const showError = submitted && !isValid;

  let borderColor = Colors.gray;
  let labelColor = Colors.mediumGray;

  if (showError) {
    borderColor = Colors.red;
    labelColor = Colors.red;
  } else if (isFocused || (submitted && isValid)) {
    borderColor = Colors.charcoal;
    labelColor = Colors.charcoal;
  }

  const handleContinue = () => {
    setSubmitted(true);

    if (isValid) {
      navigation.navigate('SendEmail');

      console.log(`

          1.) EMAIL SIGNUP
          
            Input email: ${formData.email}

        `);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={StyleSignup.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={StyleSignup.topButton}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <MaterialIcons name="arrow-back" style={StyleSignup.colorIcon} />
          </TouchableOpacity>
        </View>

        <View style={StyleSignup.midContent}>
          <Image source={Images.mail} style={StyleSignup.logo} />

          <Text style={StyleSignup.h1}>What's your email?</Text>

          <Text style={StyleSignup.p}>We'll check if you have an account</Text>

          <View
            style={[
              StyleSignup.inputContainer,
              {
                borderColor,
              },
            ]}
          >
            <Animated.Text
              style={{
                position: 'absolute',
                left: 12,
                backgroundColor: Colors.white,
                paddingHorizontal: 4,
                top: labelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, -10],
                }),
                color: labelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Colors.mediumGray, labelColor],
                }),
              }}
            >
              {showError ? 'Enter a valid email address' : 'Email'}
            </Animated.Text>
            <TextInput
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={text => {
                setFormData(prev => ({ ...prev, email: text }));

                if (submitted) {
                  setSubmitted(false);
                }
              }}
              value={formData.email}
              style={StyleSignup.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* {showError && (
              <Text
                style={{
                  color: Colors.red,
                  fontSize: 10,
                  fontWeight: '700',
                  position: 'absolute',
                  left: 14,
                  bottom: -20,
                }}
              >
                Enter a valid email address
              </Text>
            )} */}
          </View>
        </View>

        <View style={StyleSignup.botButton}>
          <View style={StyleSignup.topShadow} />
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              StyleSignup.continueButton,
              {
                backgroundColor:
                  formData.email.length > 0
                    ? Colors.darkTangerine
                    : Colors.gray,
              },
              pressed && StyleSignup.buttonPressed,
            ]}
            disabled={formData.email.length === 0}
          >
            <Text style={StyleSignup.continueText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
