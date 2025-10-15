import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constants/Colors';
import { Context } from '../contexts/Context';

export default function CartScreen({ navigation }: any) {
  const {
    cart = [],
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useContext(Context) || {};

  const increaseQty = (inventoryId: number, cartLineId: number) => {
    const item = cart.find((c: any) => c.id === cartLineId);
    if (!item) return;
    updateCartItem?.(cartLineId, item.quantity + 1);
  };

  const decreaseQty = (inventoryId: number, cartLineId: number) => {
    const item = cart.find((c: any) => c.id === cartLineId);
    if (!item) return;
    const newQty = item.quantity - 1;
    if (newQty <= 0) removeFromCart?.(cartLineId);
    else updateCartItem?.(cartLineId, newQty);
  };

  const totalPrice = cart.reduce(
    (sum: number, item: any) => sum + (item.price || 0) * item.quantity,
    0,
  );

  const clearCarts = () => {
    clearCart?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.lightTangerine}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        {cart.length > 0 && (
          <Pressable onPress={clearCarts} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear Cart</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        {cart.filter((item: any) => item.inventory).length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                {/* Image */}
                <View style={styles.itemImage}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 60, height: 60, borderRadius: 4 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Product Info */}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.product_name}</Text>
                  <Text style={styles.itemPrice}>
                    {item.price} x {item.quantity} = ₱{' '}
                    {item.price * item.quantity}
                  </Text>
                </View>

                {/* Remove Button + Quantity Controls (vertical) */}
                <View style={styles.controlsColumn}>
                  <Pressable
                    onPress={() => removeFromCart?.(item.id)}
                    style={[
                      styles.removeButton,
                      {
                        padding: 5,
                      },
                    ]}
                  >
                    <Feather name="x" size={20} color={Colors.grayBar} />
                  </Pressable>

                  <View style={styles.quantityControls}>
                    <Pressable
                      onPress={() => decreaseQty(item.inventory.id, item.id)}
                      style={styles.qtyButton}
                    >
                      <Feather name="minus" size={14} color={Colors.charcoal} />
                    </Pressable>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => increaseQty(item.inventory.id, item.id)}
                      style={[styles.qtyButton, styles.addButton]}
                    >
                      <Feather name="plus" size={14} color={Colors.white} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {cart.filter((item: any) => item.inventory).length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ₱ {totalPrice.toFixed(2)}</Text>
          <Pressable
            onPress={() => Alert.alert('Checkout', 'Proceed to payment')}
            style={styles.checkoutButton}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    padding: 16,
    borderBottomWidth: 0.2,
    borderColor: Colors.grayBar2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.charcoal },
  clearButton: {
    backgroundColor: Colors.lightTangerine,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearText: { color: Colors.white, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: Colors.grayBar2 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderBottomWidth: 0.4,
    borderColor: Colors.grayBar2,
  },
  itemImage: { width: 60, height: 60, borderRadius: 4, marginRight: 12 },
  itemDetails: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontWeight: '700', color: Colors.charcoal },
  itemPrice: { fontSize: 14, color: Colors.charcoal },
  controlsColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
  },
  removeButton: {
    marginBottom: 6,
  },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyButton: { backgroundColor: Colors.light, padding: 8, borderRadius: 6 },
  addButton: { backgroundColor: Colors.lightTangerine },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.charcoal,
    minWidth: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 0.5,
    borderColor: Colors.grayBar2,
    backgroundColor: Colors.white,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: Colors.charcoal,
  },
  checkoutButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
