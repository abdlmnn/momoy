import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Images from '../constants/Images';
import Colors from '../constants/Colors';

export default function SplashScreen({ onFinish }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        source={Images.logo}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTangerine,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
