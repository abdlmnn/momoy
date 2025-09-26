import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';

export default function BottomNavigator() {
  const [activeTab, setActiveTab] = useState('Home');
  const translateY = useState(new Animated.Value(0))[0];

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Cart':
        return <CartScreen />;
      case 'Search':
        return <SearchScreen />;
      case 'Account':
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}

      <Animated.View style={[styles.tabBar, { transform: [{ translateY }] }]}>
        <Pressable
          style={styles.tabItem}
          onPress={() => handleTabPress('Home')}
        >
          <Feather
            name="home"
            size={24}
            color={activeTab === 'Home' ? Colors.darkTangerine : Colors.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color:
                  activeTab === 'Home' ? Colors.darkTangerine : Colors.gray,
              },
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => handleTabPress('Cart')}
        >
          <Feather
            name="shopping-cart"
            size={24}
            color={activeTab === 'Cart' ? Colors.darkTangerine : Colors.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color:
                  activeTab === 'Cart' ? Colors.darkTangerine : Colors.gray,
              },
            ]}
          >
            Cart
          </Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => handleTabPress('Search')}
        >
          <Feather
            name="search"
            size={24}
            color={activeTab === 'Search' ? Colors.darkTangerine : Colors.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color:
                  activeTab === 'Search' ? Colors.darkTangerine : Colors.gray,
              },
            ]}
          >
            Search
          </Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => handleTabPress('Account')}
        >
          <Feather
            name="user"
            size={24}
            color={activeTab === 'Account' ? Colors.darkTangerine : Colors.gray}
          />
          <Text
            style={[
              styles.tabLabel,
              {
                color:
                  activeTab === 'Account' ? Colors.darkTangerine : Colors.gray,
              },
            ]}
          >
            Account
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 5,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});
