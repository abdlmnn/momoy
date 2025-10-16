import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import Colors from '../constants/Colors';

type RouteMapProps = {
  start: { latitude: number; longitude: number };
  end: { latitude: number; longitude: number };
  onRouteCalculated?: (distanceMeters: number) => void; // callback
};

export default function RouteMap({
  start,
  end,
  onRouteCalculated,
}: RouteMapProps) {
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`,
        );

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => ({
              longitude: c[0],
              latitude: c[1],
            }),
          );
          setRouteCoords(coords);

          // call callback with route distance in meters
          if (onRouteCalculated) {
            onRouteCalculated(data.routes[0].distance);
          }
        }
      } catch (error) {
        console.log('Error fetching route:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  const region: Region = {
    latitude: (start.latitude + end.latitude) / 2,
    longitude: (start.longitude + end.longitude) / 2,
    latitudeDelta: Math.abs(start.latitude - end.latitude) * 2 || 0.05,
    longitudeDelta: Math.abs(start.longitude - end.longitude) * 2 || 0.05,
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#FF8C00" />
    );

  return (
    <MapView style={styles.map} initialRegion={region}>
      <Marker coordinate={start} title="Rider Location" pinColor="orange" />

      <Marker coordinate={end} title="Your Location" pinColor="red" />

      {routeCoords.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeWidth={4}
          strokeColor="#FF8C00"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { flex: 1, borderRadius: 10 } });
