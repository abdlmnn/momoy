import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import Colors from '../constants/Colors';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../contexts/Context';
import authApi from '../services/authApi';

export default function MapScreen({ navigation }: any) {
  const { userLocation, setLocation, isLoggedIn } = useContext(Context)!;

  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [changeMode, setChangeMode] = useState(false);

  const petShopLocation = { latitude: 8.244517, longitude: 124.257706 };

  useEffect(() => {
    if (isFocused && isLoggedIn) {
      fetchUserAddresses();
    } else {
      setLoading(false);
    }
  }, [isFocused]);

  const fetchUserAddresses = async () => {
    try {
      const res = await authApi.get(`/auth/addresses/`);

      const addresses = res.data;
      console.log('Fetched addresses', addresses);

      const defaultAddress =
        addresses.find((addr: any) => addr.is_default) || addresses[0];

      if (defaultAddress) {
        const coords = {
          latitude: parseFloat(defaultAddress.latitude),
          longitude: parseFloat(defaultAddress.longitude),
        };
        setLocation(coords);
      }

      setLoading(false);
    } catch (err: any) {
      console.log(
        'Failed to fetch addresses',
        err.response?.data || err.message,
      );
      setLoading(false);
    }
  };

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

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);

      setChangeMode(false);

      console.log('Updated location:', selectedLocation);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={e => {
          if (!changeMode) return;
          setSelectedLocation(e.nativeEvent.coordinate);
        }}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="red"
          />
        )}

        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            pinColor="blue"
          />
        )}

        <Marker
          coordinate={petShopLocation}
          title="Momoy Pet Supplies"
          pinColor="orange"
        />
      </MapView>

      {isLoggedIn && (
        <View
          style={{
            position: 'absolute',
            bottom: 17,
            left: 80,
            right: 100,
          }}
        >
          {!changeMode ? (
            <Pressable
              onPress={() => setChangeMode(true)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? Colors.lightTangerine
                    : Colors.darkTangerine,
                  paddingVertical: 12,
                  borderRadius: 7,
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}
              >
                CHANGE LOCATION
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleConfirmLocation}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? Colors.lightTangerine
                    : Colors.darkTangerine,
                  paddingVertical: 12,
                  borderRadius: 7,
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}
              >
                CONFIRM LOCATION
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
