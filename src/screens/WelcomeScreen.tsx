import React, { useRef, useEffect } from 'react';
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
import Colors from '../constants/Colors';
import Images from '../constants/Images';

import { SignupButton, LoginButton, GuestButton } from '../components/Button';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.lightTangerine}
      />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Index' }],
          })
        }
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.topSection}>
        <Animated.Image
          source={Images.food}
          style={[styles.image, { transform: [{ translateY: moveAnim }] }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.textSection}>
          <Text style={styles.topBold}>Sign up or Log in</Text>

          <Text style={styles.pText}>
            Select your preferred method to continue
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <SignupButton onPress={() => navigation.navigate('Signup')} />

          <LoginButton onPress={() => navigation.navigate('Login')} />

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.text}>or</Text>
            <View style={styles.line} />
          </View>

          <GuestButton
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Index' }],
              })
            }
          />

          <Text style={styles.policyText}>
            By continuing, you agree to our{' '}
            <Text style={styles.underlineText}>Terms and Conditions</Text> and{' '}
            <Text style={styles.underlineText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTangerine,
  },

  closeButton: {
    position: 'absolute',
    top: 2,
    left: 10,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
  },

  topSection: {
    flex: 1.05,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  image: {
    height: width * 0.7,
    width: height * 0.5,
  },

  bottomSection: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  textSection: {
    gap: 5,
  },

  topBold: {
    fontWeight: '800',
    fontSize: 18,
    fontFamily: 'Poppins',
    color: Colors.charcoal,
  },

  pText: {
    fontSize: 12,
    color: Colors.charcoal,
  },

  buttonSection: {
    flex: 1,
    gap: 15,
    justifyContent: 'flex-end',
  },

  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light,
  },
  text: {
    marginHorizontal: 10,
    color: Colors.mediumGray,
    opacity: 0.4,
    fontSize: 14,
    fontWeight: '600',
  },

  policyText: {
    color: Colors.charcoal,
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: Colors.charcoal,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
