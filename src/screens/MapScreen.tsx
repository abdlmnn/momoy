import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../contexts/Context';

export default function MapScreen({ navigation }: any) {
  const { userLocation } = useContext(Context)!;

  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  const petShopLocation = { latitude: 8.244517, longitude: 124.257706 };

  useEffect(() => {
    if (isFocused) {
      setLoading(false);
    }
  }, [isFocused]);

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={Colors.lightTangerine}
      />
    );

  const initialRegion: Region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: petShopLocation.latitude,
        longitude: petShopLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="red"
          />
        )}

        <Marker
          coordinate={petShopLocation}
          title="Momoy Pet Supplies"
          pinColor="orange"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
