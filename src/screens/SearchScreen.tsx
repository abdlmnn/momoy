import React, { useContext, useState, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Text, TextInput, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constants/Colors';
import { Context } from '../contexts/Context';
import { AddToCartModal } from '../components/AddToCartModal';
import { API_URL } from '@env';
import { SwitchImages } from '../components/SwitchImages';
import { ProductWithInventories, Variant } from '../types/types';

export default function SearchScreen() {
  const { products = [], addToCart } = useContext(Context) || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithInventories[]
  >([]);
  const searchInputRef = useRef<TextInput>(null);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  });

  useEffect(() => {
    // Filter products with inventories when products change
    const validProducts = products
      .map((p: any) => ({ ...p, inventories: p.variants || [] }))
      .filter((p: any) => p.inventories.length > 0);

    setFilteredProducts(
      searchQuery
        ? validProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : validProducts,
    );
  }, [products]);

  const updateSearch = (query: string) => {
    setSearchQuery(query);

    const validProducts = products
      .map(p => ({ ...p, inventories: p.variants || [] }))
      .filter(p => p.inventories.length > 0);

    setFilteredProducts(
      query
        ? validProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()),
          )
        : validProducts,
    );
  };

  const handleAddToCart = async (data: any) => {
    if (!data?.variant?.id) return;

    try {
      await addToCart?.(data.variant.id, data.quantity ?? 1);
      setModalVisible(false);
    } catch (err) {
      console.log('Error adding to cart:', err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: '#fff',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.white,
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 3,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: Colors.gray,
        }}
      >
        <Feather name="search" size={22} color={Colors.grayBar2} />
        <TextInput
          ref={searchInputRef}
          placeholder="Search for pet products"
          value={searchQuery}
          onChangeText={updateSearch}
          style={{
            flex: 1,
            fontSize: 14,
            color: Colors.charcoal,
            marginLeft: 8,
          }}
          selectTextOnFocus
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item: any) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const inventories = item.inventories;
          const prices = inventories.map((v: any) => v.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          return (
            <Pressable
              onPress={() => console.log({ product: item })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.white,
                paddingVertical: 20,
                borderBottomWidth: 0.2,
                borderColor: Colors.gray,
                position: 'relative',
              }}
            >
              <View
                style={{
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
                  <Text style={{ fontSize: 14, color: Colors.charcoal }}>
                    {minPrice === maxPrice
                      ? `₱ ${minPrice}`
                      : `₱ ${minPrice} - ${maxPrice}`}
                  </Text>

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

      <AddToCartModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}
