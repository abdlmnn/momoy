import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

type NominatimResponse = {
  display_name: string;
};

export default function GeocodeTest() {
  const [address, setAddress] = useState<string | null>(null);

  const petShopLocation = { latitude: 8.244517, longitude: 124.257706 };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${petShopLocation.latitude}&lon=${petShopLocation.longitude}`,
          {
            headers: {
              'User-Agent': 'Momoy/1.0 (legendsalih24@gmail.com)',
            },
          },
        );
        const data: NominatimResponse = await res.json();

        if (data.display_name) {
          setAddress(data.display_name);
          console.log(data.display_name);
        } else {
          setAddress('Address not found');
        }
      } catch (err) {
        setAddress('Network error');
        console.error('Network error:', err);
      }
    };

    fetchAddress();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pet Shop Coordinates:</Text>
      <Text>Lat: {petShopLocation.latitude}</Text>
      <Text>Lng: {petShopLocation.longitude}</Text>
      <Text style={{ marginTop: 10 }}>
        {address ? `Address: ${address}` : 'Fetching address...'}
      </Text>
    </View>
  );
}
