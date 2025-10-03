import {
  Text,
  View,
  Pressable,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState, useContext } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../contexts/Context';
import authApi from '../services/authApi';

export default function AllowLocationScreen({ navigation }: any) {
  const { setLocation, setIsCreated } = useContext(Context)!;

  const [loading, setLoading] = useState(false);

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

  const saveAddress = async ({ latitude, longitude }: any) => {
    try {
      let address = 'Unknown Address';

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'User-Agent': 'Momoy/1.0 (legendsalih24@gmail.com)',
            },
          },
        );
        const data = await res.json();

        if (data?.display_name) {
          address = data.display_name;
        }
      } catch (err) {
        console.error('Reverse geocoding failed', err);
      }

      const payload = {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
        address,
        is_default: true,
      };

      const response = await authApi.post('/auth/addresses/', payload);

      console.log('Address saved', response.data);
    } catch (err: any) {
      console.log('Address save failed', err.response?.data || err.message);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude, accuracy } = pos.coords;

        console.log(`

          User location:
            
            Lat: ${latitude} 
            Lon: ${longitude} 

          `);

        await AsyncStorage.setItem('isCreated', 'true');
        setIsCreated(true);

        await setLocation({ latitude, longitude });

        navigation.reset({
          index: 0,
          routes: [{ name: 'Index' }],
        });

        await saveAddress({ latitude, longitude });

        setLoading(false);
      },
      err => {
        console.warn('User location failed', err);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5000 },
    );

    const watchId = Geolocation.watchPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;

        if (accuracy <= 30) {
          console.log(`

            Precise location:

              Lat: ${latitude} 
              Lon: ${longitude} 

          `);

          Geolocation.clearWatch(watchId);
        }
      },
      err => {
        console.warn('High-accuracy watch failed', err);
        setLoading(false);
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
      setLoading(false);
    }
  };

  const requestEnableLocation = async () => {
    try {
      setLoading(true);

      const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (status === RESULTS.GRANTED) {
        await ensureGpsEnabled();
      } else if (status === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (result === RESULTS.GRANTED) {
          await ensureGpsEnabled();
        } else {
          setLoading(false);
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
      setLoading(false);
    }
  };

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
          disabled={loading}
        >
          <Text style={StyleAllowLocation.buttonText}>
            {loading ? 'Getting your location...' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
