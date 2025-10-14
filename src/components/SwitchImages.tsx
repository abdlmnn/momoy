import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Colors from '../constants/Colors';

export const SwitchImages = ({
  images,
}: {
  images: { image: string; isNew?: boolean }[];
}) => {
  if (!images || images.length === 0) {
    return (
      <View
        style={{
          width: 80,
          height: 80,
          backgroundColor: Colors.light,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
        }}
      >
        <Text style={{ color: Colors.mediumGray, fontSize: 11 }}>No Image</Text>
      </View>
    );
  }

  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  const switchImage = (nextIndex?: number) => {
    if (images.length <= 1) return;

    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIndex(prev => nextIndex ?? (prev + 1) % images.length);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      switchImage();
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const currentVariant = images[index];

  return (
    <Pressable onPress={() => switchImage()}>
      <View style={{ position: 'relative' }}>
        <Animated.Image
          source={
            typeof currentVariant.image === 'string'
              ? { uri: currentVariant.image }
              : currentVariant.image
          }
          style={{ width: 80, height: 80, borderRadius: 4, opacity }}
          resizeMode="cover"
        />

        {currentVariant.isNew && (
          <View
            style={{
              position: 'absolute',
              top: -5,
              left: 23,
              backgroundColor: Colors.lightTangerine,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: 'white' }}>
              NEW
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};
