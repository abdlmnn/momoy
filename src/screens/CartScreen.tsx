import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constants/Colors';
// import { Product } from '../types/types';

interface Product {
  id: number;
  name: string;
  categoryId: number;
  productType: string;
  stock: number;
  isNew?: boolean;
  price: number;
}

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState<
    (Product & { quantity: number })[]
  >([
    {
      id: 1,
      name: 'AOZI DOG FOOD DRY - PUPPY',
      price: 1200,
      categoryId: 3,
      productType: 'Dry Food',
      stock: 5,
      isNew: true,
      quantity: 1,
    },
    {
      id: 3,
      name: 'Pet Collar',
      price: 350,
      categoryId: 2,
      productType: 'Other Essentials',
      stock: 3,
      isNew: true,
      quantity: 2,
    },
  ]);

  const increaseQty = (productId: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (productId: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>
      <View style={styles.content}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Feather name="shopping-cart" size={48} color={Colors.mediumGray} />
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    ₱{item.price} x {item.quantity} = ₱
                    {item.price * item.quantity}
                  </Text>
                </View>
                <View style={styles.quantityControls}>
                  <Pressable
                    onPress={() => decreaseQty(item.id)}
                    style={styles.qtyButton}
                  >
                    <Feather name="minus" size={16} color={Colors.charcoal} />
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => increaseQty(item.id)}
                    style={[styles.qtyButton, styles.addButton]}
                  >
                    <Feather name="plus" size={16} color={Colors.white} />
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ₱{totalPrice}</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: Colors.grayBar2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.mediumGray,
    marginTop: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderBottomWidth: 0.4,
    borderColor: Colors.grayBar2,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.light,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.charcoal,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    backgroundColor: Colors.light,
    padding: 8,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: Colors.lightTangerine,
  },
  quantityText: {
    fontSize: 16,
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
  checkoutText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
