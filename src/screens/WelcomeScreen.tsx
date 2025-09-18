import React, { useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Animated,
  Pressable,
} from 'react-native';
import { StyleWelcome } from '../styles/WelcomeScreen';

import { SignupButton, LoginButton, GuestButton } from '../components/Button';

import { Context } from '../contexts/Context';

export default function WelcomeScreen({ navigation }: any) {
  const { Images, Colors } = useContext(Context)!;

  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: -20,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={StyleWelcome.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.lightTangerine}
      />

      <TouchableOpacity
        style={StyleWelcome.closeButton}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Index' }],
          })
        }
      >
        <Text style={StyleWelcome.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={StyleWelcome.topSection}>
        <Animated.Image
          source={Images.food}
          style={[
            StyleWelcome.image,
            { transform: [{ translateY: moveAnim }] },
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={StyleWelcome.bottomSection}>
        <View style={StyleWelcome.textSection}>
          <Text style={StyleWelcome.topBold}>Sign up or Log in</Text>

          <Text style={StyleWelcome.pText}>
            Select your preferred method to continue
          </Text>
        </View>

        <View style={StyleWelcome.buttonSection}>
          <SignupButton onPress={() => navigation.navigate('Signup')} />

          <LoginButton onPress={() => navigation.navigate('CreateAccount')} />

          <View style={StyleWelcome.lineContainer}>
            <View style={StyleWelcome.line} />
            <Text style={StyleWelcome.text}>or</Text>
            <View style={StyleWelcome.line} />
          </View>

          <GuestButton
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Index' }],
              })
            }
          />

          <Text style={StyleWelcome.policyText}>
            By continuing, you agree to our{' '}
            <Text style={StyleWelcome.underlineText}>Terms and Conditions</Text>{' '}
            and <Text style={StyleWelcome.underlineText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
