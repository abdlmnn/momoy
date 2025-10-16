import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import RouteMap from '../components/RouteMap';
import { Context } from '../contexts/Context';
import ChatModal from '../components/ChatModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = (SCREEN_WIDTH * 9) / 16;

export default function OrderSummaryScreen({ route, navigation }: any) {
  const { userLocation, isLoggedIn } = useContext(Context)!;
  const { order, payment } = route.params;

  const displayOrder = {
    ...order,
    payment: payment || order.payment,
  };

  const [eta, setEta] = useState<string>('-');
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState(
    displayOrder.messages || [
      { id: 1, sender: 'admin', text: 'Your order is being processed.' },
    ],
  );

  if (!displayOrder) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No order details found.</Text>
      </View>
    );
  }

  const formattedDate = displayOrder.created_at
    ? new Date(displayOrder.created_at).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  const formattedTotal = Number(displayOrder.total_amount || 0).toLocaleString(
    'en-PH',
    {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    },
  );

  const getStatusColor = (status: string) => {
    if (!status) return Colors.grayBar;
    return status.toLowerCase() === 'completed'
      ? Colors.green
      : Colors.lightTangerine;
  };

  // Memoized FlatList Header (without Map)
  const headerComponent = useMemo(
    () => (
      <View>
        {/* <Text style={styles.title}>My Order</Text> */}

        {/* Order Info */}
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{displayOrder.id}</Text>
          </View>
          <View style={[styles.rowItem, { alignItems: 'flex-start' }]}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>
              {displayOrder.payment?.method?.toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={[styles.rowItem, { alignItems: 'flex-start' }]}>
            <Text style={styles.label}>Payment Status</Text>
            <Text
              style={[
                styles.value,
                { color: getStatusColor(displayOrder.payment?.status) },
              ]}
            >
              {displayOrder.payment?.status?.toUpperCase() || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.totalValue}>{formattedTotal}</Text>
        </View>

        {/* Items Header */}
        <Text style={[styles.label, { marginHorizontal: 16 }]}>Items</Text>
      </View>
    ),
    [displayOrder, formattedDate, formattedTotal],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Order</Text>

      {userLocation && (
        <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
          <RouteMap
            start={{ latitude: 8.244517, longitude: 124.257706 }}
            end={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            onRouteCalculated={distanceMeters => {
              if (eta !== '-') return; // calculate once

              // Convert distance to km
              const distanceKm = distanceMeters / 1000;

              // Average speed based on distance
              let averageSpeedKmh = 40; // default city speed
              if (distanceKm > 10) averageSpeedKmh = 60; // faster on highways

              // Travel time in seconds
              const travelSeconds = (distanceKm / averageSpeedKmh) * 3600;

              const etaDate = new Date();
              etaDate.setSeconds(etaDate.getSeconds() + travelSeconds);

              setEta(
                etaDate.toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }),
              );
            }}
          />
          <Text style={styles.etaText}>Estimated Arrival: {eta}</Text>
        </View>
      )}

      {/* Order Items */}
      <FlatList
        data={displayOrder.orderlines || []}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image
              source={{ uri: item.inventory?.image }}
              style={styles.itemImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>
                {item.inventory?.product_name}
              </Text>
              <Text style={styles.itemPrice}>
                ₱ {Number(item.price).toFixed(2)} × {item.quantity}
              </Text>
            </View>
          </View>
        )}
        ListHeaderComponent={headerComponent}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={styles.doneButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Index' }],
            })
          }
        >
          <Text style={styles.doneText}>Back to Home</Text>
        </Pressable>
      </View>

      {/* Chat Button */}
      <Pressable style={styles.chatButton} onPress={() => setChatVisible(true)}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={35}
          color={Colors.grayBar2}
        />
        {messages.length > 0 && <View style={styles.redDot} />}
      </Pressable>

      {/* Chat Modal */}
      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        initialMessages={
          displayOrder.messages || [
            { id: 1, sender: 'admin', text: 'Your order is being processed.' },
          ]
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: Colors.grayBar },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.charcoal,
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rowItem: { flex: 1 },
  section: { marginBottom: 20, marginHorizontal: 16 },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 4,
  },
  value: { fontSize: 14, color: Colors.charcoal },
  totalValue: { fontSize: 14, fontWeight: '600', color: Colors.lightTangerine },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 6,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.gray,
  },
  itemImage: { width: 90, height: 90, borderRadius: 6, marginRight: 12 },
  itemName: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: Colors.charcoal,
  },
  itemPrice: { fontSize: 14, color: Colors.grayBar, marginTop: 5 },

  mapContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  etaText: {
    fontSize: 14,
    color: Colors.lightTangerine,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 6,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doneButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  doneText: { color: Colors.white, fontWeight: '600', fontSize: 16 },

  chatButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 30,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  redDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: Colors.red,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});
