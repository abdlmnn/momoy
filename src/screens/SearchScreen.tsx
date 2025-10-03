import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constants/Colors';

const products = [
  {
    id: 1,
    name: 'AOZI DOG FOOD DRY - PUPPY',
    price: 1200,
    categoryId: 3,
    productType: 'Dry Food',
    isNew: true,
    stock: 5,
  },
  {
    id: 2,
    name: 'AOZI DOG FOOD DRY GOLD - ADULT (SACK)',
    price: 450,
    categoryId: 4,
    productType: 'Dry Food',
    stock: 0,
  },
  {
    id: 3,
    name: 'Pet Collar',
    price: 350,
    categoryId: 2,
    productType: 'Other Essentials',
    stock: 3,
    isNew: true,
  },
  {
    id: 4,
    name: 'Scratching Post',
    price: 700,
    categoryId: 1,
    productType: 'Other Essentials',
    stock: 10,
    isNew: true,
  },
  {
    id: 5,
    name: 'Dog Bed',
    price: 1500,
    categoryId: 2,
    productType: 'Other Essentials',
    stock: 0,
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const searchInputRef = useRef<TextInput>(null);

  useFocusEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  });

  const updateSearch = (query: string): void => {
    setSearchQuery(query);
    if (query) {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={22} color={Colors.grayBar2} />
        <TextInput
          ref={searchInputRef}
          placeholder="Search for pet food"
          value={searchQuery}
          onChangeText={updateSearch}
          style={styles.searchInput}
          selectTextOnFocus={true}
        />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const isOutOfStock = item.stock === 0;

          return (
            <Pressable
              onPress={() => {
                console.log({ product: item });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.white,
                paddingVertical: 20,
                borderBottomWidth: 0.4,
                borderColor: Colors.grayBar2,
                position: 'relative',
              }}
            >
              {/* Left: Image Placeholder */}
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: Colors.light,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              />

              {/* NEW Tag positioned absolute */}
              {item.isNew && (
                <View
                  style={{
                    position: 'absolute',
                    top: 13,
                    left: 22,
                    backgroundColor: Colors.lightTangerine,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6,
                    elevation: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: Colors.white,
                    }}
                  >
                    NEW
                  </Text>
                </View>
              )}

              {/* Middle: Product Info */}
              <View style={{ flex: 1, gap: 5 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: Colors.charcoal,
                  }}
                >
                  {item.name}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.charcoal,
                    }}
                  >
                    ₱{item.price}
                  </Text>

                  {/* Right: Add to Cart (+ button) */}
                  <Pressable
                    onPress={() => console.log('Add to cart:', item.name)}
                    style={{
                      backgroundColor: Colors.darkTangerine,
                      width: 30,
                      height: 30,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Feather name="plus" size={16} color={Colors.white} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.charcoal,
    marginLeft: 8,
  },
  productItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contentStyle: {
    height: 40,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
});
