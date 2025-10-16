import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Colors from '../constants/Colors';
import Feather from 'react-native-vector-icons/Feather';
import { API_URL } from '@env';

const screenHeight = Dimensions.get('window').height;

type AddToCartModalProps = {
  visible: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: (data: { product: any; variant: any; quantity: number }) => void;
  isLoggedIn?: boolean;
};

export const AddToCartModal = ({
  visible,
  onClose,
  product,
  onAddToCart,
  isLoggedIn,
}: AddToCartModalProps) => {
  const isReady = !!product;

  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.inventories?.[0] || null,
  );

  const [imageUri, setImageUri] = useState(
    selectedVariant?.image || product?.image,
  );

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (visible && product) {
      setSelectedVariant(product.inventories?.[0] || null);
      setQuantity(1);
    }
  }, [visible, product]);

  useEffect(() => {
    if (selectedVariant || product?.image) {
      setImageUri(selectedVariant?.image || product?.image);
    }
  }, [selectedVariant, product]);

  const handleAdd = () => {
    if (!isLoggedIn) {
      console.log('Please log in to add items to cart.');
      return;
    }

    if (selectedVariant && product) {
      onAddToCart({ product, variant: selectedVariant, quantity });
      onClose();
    }
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        {isReady && (
          <View style={styles.sheet}>
            {/* Close button */}
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={Colors.mediumGray} />
            </Pressable>

            {/* Images and Details */}
            <View style={styles.header}>
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.image}
              />

              <View style={{ flex: 1, paddingHorizontal: 10, gap: 4 }}>
                <Text style={[styles.name, { textTransform: 'uppercase' }]}>
                  {product.name}
                </Text>

                <Text style={styles.price}>₱ {selectedVariant?.price}</Text>

                <Text style={styles.stock}>
                  Stock: {selectedVariant?.stock || 0}
                </Text>
              </View>
            </View>

            {/* Variant Selection */}
            <View style={{ marginVertical: 14 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>
                Available Sizes
              </Text>

              {product.inventories.length <= 6 ? (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={product.inventories}
                  keyExtractor={(v: any) => v.id.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => setSelectedVariant(item)}
                      style={[
                        styles.variantButton,
                        selectedVariant?.id === item.id &&
                          styles.variantButtonSelected,
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            selectedVariant?.id === item.id
                              ? Colors.white
                              : Colors.charcoal,
                          fontWeight: '600',
                        }}
                      >
                        {item.size}
                      </Text>
                    </Pressable>
                  )}
                />
              ) : (
                <FlatList
                  data={product.inventories}
                  keyExtractor={(v: any) => v.id.toString()}
                  numColumns={3}
                  scrollEnabled={true}
                  style={{ maxHeight: 150 }}
                  columnWrapperStyle={{ justifyContent: 'flex-start' }}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => setSelectedVariant(item)}
                      style={[
                        styles.variantButton,
                        selectedVariant?.id === item.id &&
                          styles.variantButtonSelected,
                        { marginBottom: 8 },
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            selectedVariant?.id === item.id
                              ? Colors.white
                              : Colors.charcoal,
                          fontWeight: '600',
                        }}
                      >
                        {item.size}
                      </Text>
                    </Pressable>
                  )}
                />
              )}
            </View>

            {/* Quantity Selector */}
            <View style={[styles.qtyRow]}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.qtyControl}>
                <Pressable onPress={decreaseQty} style={styles.qtyButton}>
                  <Feather name="minus" size={20} color={Colors.charcoal} />
                </Pressable>
                <Text style={styles.qtyText}>{quantity}</Text>
                <Pressable onPress={increaseQty} style={styles.qtyButton}>
                  <Feather name="plus" size={20} color={Colors.charcoal} />
                </Pressable>
              </View>
            </View>

            {/* Add to Cart Button */}
            <Pressable style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.75,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    // width: 80,
    // height: 80,
    width: 160,
    height: 160,
    borderRadius: 8,
    backgroundColor: Colors.light,
  },
  name: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.charcoal,
  },
  price: {
    color: Colors.darkTangerine,
    fontWeight: '700',
    fontSize: 16,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  variantButton: {
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  variantButtonSelected: {
    backgroundColor: Colors.darkTangerine,
    borderColor: Colors.darkTangerine,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 6,
    padding: 6,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: Colors.darkTangerine,
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  closeBtn: {
    position: 'absolute',
    right: 15,
    top: 10,
    zIndex: 5,
    padding: 4,
    // backgroundColor: Colors.white,
    // borderRadius: 20,
    // elevation: 2,
  },
  stock: {
    color: Colors.mediumGray,
    fontSize: 14,
    marginTop: 4,
  },
});
