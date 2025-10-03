import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  StatusBar,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { getCategories, getProducts, getUserAddress } from '../services/api';
import { Product, Categories } from '../types/types';
import { StyleHome } from '../styles/HomeScreen';
import Colors from '../constants/Colors';
import Lucide from 'react-native-vector-icons/Lucide';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../types/types';
import { Context } from '../contexts/Context';

const categories = [
  { id: 0, name: 'All Products' },
  { id: 1, name: 'Kitten' },
  { id: 2, name: 'Adult Cat' },
  { id: 3, name: 'Puppy' },
  { id: 4, name: 'Adult Dog' },
];

const productTypes = [
  'Dry Food',
  'Wet Food',
  'Pet Care',
  'Pet Treats',
  'Pet Milk',
  'Cat Litter',
  'Other Essentials',
  'Merch',
];
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

export default function HomeScreen({ navigation }: any) {
  const { isLoggedIn } = useContext(Context)!;

  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesCategory =
      selectedCategory === 0 || p.categoryId === selectedCategory;
    const matchesType = !selectedType || p.productType === selectedType;
    return matchesCategory && matchesType;
  });

  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!isLoggedIn) return;

        const data = await getUserAddress();

        // console.log(data);

        if (data.length > 0) {
          const defaultAddress = data.find(addr => addr.is_default) || data[0];

          setAddress(defaultAddress);
        }
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.log('Failed to load address:', error);
        }
      }
    };

    fetchAddress();
  }, [isLoggedIn]);

  return (
    <View style={[StyleHome.container]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.lightTangerine}
      />

      <View style={[StyleHome.topBar]}>
        <View style={[StyleHome.upRow]}>
          <Pressable
            onPress={() => navigation.navigate('Map')}
            style={StyleHome.mapPinRow}
          >
            <Feather name="map-pin" size={20} color={Colors.white} />

            <View style={StyleHome.addressWrapper}>
              <Text
                style={StyleHome.addressText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {address ? address.address : 'Where do you live?'}
              </Text>
              <Text style={StyleHome.cityText}>Iligan City</Text>
            </View>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              navigation.navigate('Search');
            }}
            style={StyleHome.bottomRow}
          >
            <Feather name="search" size={22} color={Colors.grayBar2} />
            <Text style={StyleHome.searchInput}>
              What does your pet need today?
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilterVisible(true)}
            style={({ pressed }) => [
              {
                // borderWidth: 1,
                borderRadius: 7,
                // borderColor: Colors.white,
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: pressed ? Colors.light : Colors.white,
              },
            ]}
          >
            <Feather name="menu" size={22} color={Colors.grayBar2} />
          </Pressable>
        </View>
      </View>

      <View style={StyleHome.botBar}>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingVertical: 12,
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', opacity: 0.7 }}>
            Categories
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={StyleHome.categoryRow}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedCategory(item.id)}
                  style={[
                    StyleHome.categoryItem,
                    {
                      backgroundColor:
                        selectedCategory === item.id
                          ? Colors.lightTangerine
                          : Colors.white,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        selectedCategory === item.id
                          ? Colors.white
                          : Colors.mediumGray,
                      fontWeight: '600',
                    }}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* Products */}
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
                  // navigation.navigate('ProductDetails', { product: item })
                  console.log({ product: item });
                }}
                // disabled={isOutOfStock}
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
                >
                  {/* <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: Colors.charcoal,
                    }}
                  >
                    IMG
                  </Text> */}
                </View>

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
                      // marginBottom: 4,
                      color: Colors.charcoal,
                    }}
                  >
                    {item.name}
                  </Text>

                  <View
                    style={{
                      // borderWidth: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      // gap: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.charcoal,
                        // marginBottom: 2,
                      }}
                    >
                      ₱{item.price}
                    </Text>

                    {/* {item.isNew && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.lightTangerine,
                          paddingRight: 20,
                        }}
                      >
                        NEW
                      </Text>
                    )} */}

                    {/* Right: Add to Cart (+ button) */}
                    <Pressable
                      onPress={() => console.log('Add to cart:', item.name)}
                      style={{
                        // backgroundColor: isOutOfStock
                        //   ? Colors.grayBar2
                        //   : Colors.lightTangerine,
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

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="none"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '70%',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>
              Filter
            </Text>

            {/* Categories */}
            <Text style={{ fontWeight: '600', marginBottom: 6 }}>
              Categories
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 20,
              }}
            >
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      selectedCategory === cat.id
                        ? Colors.lightTangerine
                        : Colors.gray,
                    backgroundColor:
                      selectedCategory === cat.id
                        ? Colors.lightTangerine
                        : Colors.white,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedCategory === cat.id
                          ? Colors.white
                          : Colors.mediumGray,
                      fontWeight: '600',
                    }}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Product Type */}
            <Text style={{ fontWeight: '600', marginBottom: 6 }}>
              Product Type
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {productTypes.map(type => (
                <Pressable
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 7,
                    borderWidth: 1,
                    borderColor:
                      selectedType === type
                        ? Colors.lightTangerine
                        : Colors.gray,
                    backgroundColor:
                      selectedType === type
                        ? Colors.lightTangerine
                        : Colors.white,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedType === type
                          ? Colors.white
                          : Colors.mediumGray,
                      fontWeight: '600',
                    }}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedCategory(0);
                  setSelectedType(null);
                }}
                style={{ padding: 12 }}
              >
                <Text style={{ color: Colors.mediumGray, fontWeight: '600' }}>
                  Reset
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setFilterVisible(false)}
                style={{
                  backgroundColor: Colors.darkTangerine,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: '700' }}>
                  Apply
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
