import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import Feather from 'react-native-vector-icons/Feather';
import { Context } from '../contexts/Context';

export default function CheckOutScreen({ route, navigation }: any) {
  const cart = route.params?.cart || [];

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Gcash' | null>(
    null,
  );

  const totalPrice = cart.reduce(
    (sum: number, item: any) => sum + (Number(item.price) || 0) * item.quantity,
    0,
  );

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Placed',
      `Payment Method: ${paymentMethod}\nTotal: ₱${totalPrice.toFixed(2)}`,
    );
    navigation.goBack();
  };

  const renderCartItem = ({ item }: any) => (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.product_name}</Text>
          <Text style={styles.itemPrice}>
            ₱ {(Number(item.price) || 0).toFixed(2)} x {item.quantity} = ₱{' '}
            {((Number(item.price) || 0) * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAddress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>

      <Text style={styles.addressText}>Mohammad Abdulmanan</Text>

      <Text style={styles.addressText}>
        Iligan City, San Miguel Cpark, Philippines
      </Text>

      <Text style={styles.addressText}>+63 912 345 6789</Text>

      <Pressable style={styles.editAddressButton}>
        <Text style={styles.editAddressText}>Edit Address</Text>
      </Pressable>
    </View>
  );

  const renderPaymentMethod = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethods}>
        <Pressable
          onPress={() => setPaymentMethod('COD')}
          style={[
            styles.paymentButton,
            paymentMethod === 'COD' && styles.paymentButtonSelected,
          ]}
        >
          <Image source={Images.cod} style={styles.paymentIcon} />
          <Text
            style={[
              styles.paymentText,
              paymentMethod === 'COD' && styles.paymentTextSelected,
            ]}
          >
            Cash on Delivery
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPaymentMethod('Gcash')}
          style={[
            styles.paymentButton,
            paymentMethod === 'Gcash' && styles.paymentButtonSelected,
          ]}
        >
          <Image source={Images.gcash} style={styles.paymentIcon} />
          <Text
            style={[
              styles.paymentText,
              paymentMethod === 'Gcash' && styles.paymentTextSelected,
            ]}
          >
            GCash
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.lightTangerine}
      />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color={Colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {renderAddress()}
              {renderPaymentMethod()}
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
            </View>
          }
          renderItem={renderCartItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₱ {totalPrice.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.checkoutButton} onPress={handlePlaceOrder}>
            <Text style={styles.checkoutText}>Place Order</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.2,
    borderColor: Colors.light,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.charcoal,
  },

  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: Colors.grayBar2 },

  listHeader: {
    paddingHorizontal: 16,
  },

  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 16,
    paddingBottom: 8,
    color: Colors.charcoal,
  },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.2,
    borderColor: Colors.light,
  },
  itemImage: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '700', color: Colors.charcoal },
  itemPrice: { fontSize: 14, color: Colors.charcoal, marginTop: 4 },

  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.charcoal,
  },

  addressText: { fontSize: 14, color: Colors.charcoal, marginBottom: 4 },
  editAddressButton: { marginTop: 4, paddingVertical: 4 },
  editAddressText: { color: Colors.darkTangerine, fontWeight: '700' },

  paymentMethods: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentButton: {
    flex: 1, // make both buttons same width
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // center content inside
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.grayBar,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginHorizontal: 5, // spacing between buttons
  },
  paymentButtonSelected: {
    borderColor: Colors.charcoal,
  },
  paymentIcon: { width: 24, height: 24, marginRight: 6 },
  paymentText: { color: Colors.grayBar, fontWeight: '600', fontSize: 14 },
  paymentTextSelected: { color: Colors.charcoal },

  footer: {
    position: 'absolute',
    bottom: -2,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    elevation: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  totalLabel: { fontSize: 16, fontWeight: '500', color: Colors.charcoal },
  totalAmount: { fontSize: 16, fontWeight: '500', color: Colors.charcoal },
  checkoutButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 5,
  },
  checkoutText: { color: Colors.white, fontWeight: '600', fontSize: 16 },
});
