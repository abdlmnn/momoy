import { Text, View, Pressable, Animated, Alert } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Images from '../constants/Images';
import { StyleAllowLocation } from '../styles/AllowLocation';
import BenefitRow from './common/BenefitRow';
import Geolocation from '@react-native-community/geolocation';
import * as RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export default function AllowLocationScreen() {
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;

        console.log(`
          User location:
          Lat: ${latitude} 
          Lon: ${longitude} 
          `);

        // API for Google Map
      },
      err => {
        console.warn('User location failed', err);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 },
    );

    const watchId = Geolocation.watchPosition(
      pos => {
        console.log('Precise location:', pos);

        const { latitude, longitude, accuracy } = pos.coords;

        if (accuracy <= 30) {
          console.log(`
          User location:
          Lat: ${latitude} 
          Lon: ${longitude} 
          `);
          Geolocation.clearWatch(watchId);
        }
      },
      err => {
        console.warn('High-accuracy watch failed', err);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const ensureGpsEnabled = async () => {
    try {
      const res =
        await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
        });

      console.log('GPS:', res);

      if (res === 'enabled' || res === 'already-enabled') {
        getLocation();
      }
    } catch (err) {
      console.log('Not enable GPS', err);
      Alert.alert(
        'GPS Required',
        'Please enable location services to continue.',
      );
    }
  };

  const requestEnableLocation = async () => {
    try {
      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (status === RESULTS.GRANTED) {
        await ensureGpsEnabled();
      } else if (status === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result === RESULTS.GRANTED) {
          await ensureGpsEnabled();
        }
      } else if (status === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Location permission is blocked. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 15,
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
    <View style={StyleAllowLocation.container}>
      <View style={StyleAllowLocation.upChild}>
        <Animated.Image
          source={Images.location}
          style={[
            StyleAllowLocation.logo,
            { transform: [{ translateY: moveAnim }] },
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={StyleAllowLocation.downChild}>
        <View style={StyleAllowLocation.benefitContainer}>
          <Text style={StyleAllowLocation.title}>
            Allow location access on the next screen to:
          </Text>

          <BenefitRow
            BenefitRow={StyleAllowLocation.benefitRow}
            Images={Images.pinLocation}
            ImageLogo={StyleAllowLocation.imageLogo}
            StyleText={StyleAllowLocation.subtitle}
            Text="Auto-detect your location."
          />

          <BenefitRow
            BenefitRow={StyleAllowLocation.benefitRow}
            Images={Images.deliveryLocation}
            ImageLogo={StyleAllowLocation.imageLogo}
            StyleText={StyleAllowLocation.subtitle}
            Text="Faster pet food delivery."
          />
        </View>

        <Pressable
          onPress={requestEnableLocation}
          style={({ pressed }) => [
            StyleAllowLocation.button,
            pressed && StyleAllowLocation.buttonPressed,
          ]}
        >
          <Text style={StyleAllowLocation.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
