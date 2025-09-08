import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { getCategories, getProducts } from '../services/api';
import { Product, Categories } from '../types/types';
import { StyleHome } from '../styles/HomeScreen';

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProducts();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategory = async () => {
      try {
        const data = await getCategories();
        console.log(data);
        setCategory(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchCategory();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  return (
    // <View style={{ flex: 1, padding: 16 }}>
    //   <FlatList
    //     data={products}
    //     keyExtractor={item => item.id.toString()}
    //     renderItem={({ item }) => (
    //       <View style={{ marginBottom: 16 }}>
    //         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
    //           {item.name}
    //         </Text>
    //         <Text>{item.stage}</Text>
    //       </View>
    //     )}
    //   />

    //   <View>
    //     <FlatList
    //       data={category}
    //       keyExtractor={item => item.id.toString()}
    //       renderItem={({ item }) => (
    //         <View style={{ marginBottom: 16 }}>
    //           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
    //             {item.name}
    //           </Text>
    //         </View>
    //       )}
    //     />
    //   </View>
    // </View>
    <View style={StyleHome.container}>
      <View style={StyleHome.topBar}>
        <View></View>
        <View style={StyleHome.searchContainer}>
          <TextInput placeholder="Search here" style={StyleHome.search} />
        </View>
      </View>

      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
