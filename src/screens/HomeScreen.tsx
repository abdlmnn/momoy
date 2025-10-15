import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../types/types';
import { Context } from '../contexts/Context';
import { SwitchImages } from '../components/SwitchImages';
import Images from '../constants/Images';
import { API_URL } from '@env';
import { AddToCartModal } from '../components/AddToCartModal';

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

export default function HomeScreen({ navigation }: any) {
  const {
    isLoggedIn,
    products = [],
    categories = [],
    loadingData,
    refreshData,
    addToCart,
  } = useContext(Context) || {};

  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    refreshData?.();
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const allCat = categories.find(c => c.name.toLowerCase().includes('all'));

      if (allCat) {
        setSelectedCategory(allCat.id);
      } else {
        const firstValid = categories.find(
          c => !['cat', 'dog'].includes(c.name.toLowerCase()),
        );
        if (firstValid) setSelectedCategory(firstValid.id);
      }
    }
  }, [categories]);

  const allProductsCategory = (categories || []).find(c =>
    c.name.toLowerCase().includes('all'),
  );

  const allProductsId = allProductsCategory ? allProductsCategory.id : 0;

  const combinedProducts = (products || []).map(product => ({
    ...product,
    inventories: product.variants || [],
  }));

  const filteredProducts = combinedProducts.filter(p => {
    const hasVariants = p.inventories && p.inventories.length > 0;

    const matchesCategory =
      selectedCategory === allProductsId ||
      String(p.categoryId) === String(selectedCategory);

    const backendProductType = selectedType
      ? selectedType.replace(/ /g, '_').toLowerCase()
      : null;

    const matchesType =
      !backendProductType || p.product_type === backendProductType;

    return hasVariants && matchesCategory && matchesType;
  });

  const handleAddToCart = async (data: any) => {
    if (!data?.variant?.id) return;
    try {
      await addToCart?.(data.variant.id, data.quantity);
      setModalVisible(false);
    } catch (err) {
      console.log('Error adding to cart:', err);
    }
  };

  const [address, setAddress] = useState<Address | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAddress = async () => {
        try {
          if (!isLoggedIn) return;

          const data = await getUserAddress();

          if (data.length > 0) {
            const defaultAddress =
              data.find(addr => addr.is_default) || data[0];
            setAddress(defaultAddress);
          }
        } catch (error: any) {
          if (error.response?.status !== 401) {
            console.log('Failed to load address:', error);
          }
        }
      };

      fetchAddress();
    }, [isLoggedIn]),
  );

  // useEffect(() => {
  //   const fetchAddress = async () => {
  //     try {
  //       if (!isLoggedIn) return;

  //       const data = await getUserAddress();

  //       // console.log(data);

  //       if (data.length > 0) {
  //         const defaultAddress = data.find(addr => addr.is_default) || data[0];

  //         setAddress(defaultAddress);
  //       }
  //     } catch (error: any) {
  //       if (error.response?.status !== 401) {
  //         console.log('Failed to load address:', error);
  //       }
  //     }
  //   };

  //   fetchAddress();
  // }, [isLoggedIn]);

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
            <Octicons name="filter" size={22} color={Colors.grayBar2} />
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
              data={categories.filter(
                item => !['cat', 'dog'].includes(item.name.toLowerCase()), // ❌ hide Cat & Dog
              )}
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

        {loadingData ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.lightTangerine} />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={loadingData}
            onRefresh={() => {
              setSelectedCategory(allProductsId);
              setSelectedType(null);
              refreshData?.();
            }}
            renderItem={({ item }) => {
              const inventories = item.inventories || [];
              const prices = inventories.map((v: any) => v.price);
              const hasInventories = prices.length > 0;
              const minPrice = hasInventories
                ? Math.min(...prices)
                : item.price;
              const maxPrice = hasInventories
                ? Math.max(...prices)
                : item.price;

              return (
                <Pressable
                  onPress={() => {
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
                      // 80 x 80
                      width: 100,
                      height: 100,
                      borderRadius: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <SwitchImages
                      images={inventories
                        .filter((v: any) => v.image)
                        .map((v: any) => ({
                          image: `${API_URL}${v.image}`,
                          isNew: v.is_new,
                        }))}
                    />
                  </View>

                  {/* Middle: Product Info */}
                  <View style={{ flex: 1, gap: 5 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: Colors.charcoal,
                        textTransform: 'uppercase',
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
                        {hasInventories
                          ? minPrice === maxPrice
                            ? `₱ ${minPrice}`
                            : `₱ ${minPrice} - ${maxPrice}`
                          : `₱ ${item.price}`}
                      </Text>

                      {/* Right: Add to Cart (+ button) */}
                      <Pressable
                        onPress={() => {
                          setSelectedProduct(item);
                          setModalVisible(true);
                        }}
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
        )}
      </View>

      {/* Add to Cart Modal */}
      <AddToCartModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        isLoggedIn={isLoggedIn}
      />

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
              {categories
                .filter(cat => !['cat', 'dog'].includes(cat.name.toLowerCase()))
                .map(cat => (
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
                  // setSelectedCategory(0);
                  setSelectedCategory(allProductsId);
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
