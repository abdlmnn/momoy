import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { Context } from '../contexts/Context';
import Colors from '../constants/Colors';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen({ navigation }: any) {
  const { isLoggedIn, logout } = useContext(Context)!;

  console.log('Auth:', isLoggedIn);

  const handleLogout = async () => {
    try {
      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (e) {
      console.log('Logout failed:', e);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Text style={styles.fullName}>Mohammad Abdulmanan</Text>
      </View>

      {/* Menu Sections */}
      <View style={styles.menuContainer}>
        {/* Box Row for Orders, Favourites, Addresses */}
        <View style={styles.boxRow}>
          <Pressable style={styles.boxItem}>
            <Feather name="clipboard" size={20} color={Colors.charcoal} />
            <Text style={styles.boxText}>Orders</Text>
          </Pressable>

          <Pressable style={styles.boxItem}>
            <Feather name="heart" size={20} color={Colors.charcoal} />
            <Text style={styles.boxText}>Favourites</Text>
          </Pressable>

          <Pressable style={styles.boxItem}>
            <Feather name="map-pin" size={20} color={Colors.charcoal} />
            <Text style={styles.boxText}>Addresses</Text>
          </Pressable>
        </View>

        <Pressable style={styles.menuItem}>
          <Feather name="user" size={24} color={Colors.charcoal} />
          <Text style={styles.menuText}>View profile</Text>
          <Feather name="chevron-right" size={20} color={Colors.grayBar2} />
        </Pressable>
      </View>

      {/* Logout Button */}
      <View style={styles.bottomSection}>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
        <Text style={styles.versionText}>Version 1.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.2,
    borderColor: Colors.gray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  profileSection: {
    alignItems: 'flex-start',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.lightGray,
  },

  fullName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  menuContainer: {
    backgroundColor: Colors.white,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grayBar2,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: Colors.charcoal,
    marginLeft: 12,
  },

  bottomSection: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    width: '90%',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    borderColor: Colors.charcoal,
    borderWidth: 1,
  },
  logoutText: {
    color: Colors.charcoal,
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray,
  },
  boxItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 6,
    width: 100,
    height: 80,
    marginBottom: 20,
  },
  boxText: {
    fontSize: 12,
    color: Colors.charcoal,
    textAlign: 'center',
  },
});
