import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/translations';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { language, changeLanguage } = useLanguage();

  const t = (key) => getTranslation(language, key);

  const handleLanguageChange = async (newLanguage) => {
    await changeLanguage(newLanguage);
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>{user?.role === 'FARMER' ? t('profile') : 'Profile'}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>{user?.role === 'FARMER' ? t('name') : 'Name'}:</Text>
          <Text style={styles.value}>{user?.full_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{user?.role === 'FARMER' ? t('email') : 'Email'}:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{user?.role === 'FARMER' ? t('role') : 'Role'}:</Text>
          <Text style={styles.value}>{user?.role}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{user?.role === 'FARMER' ? t('userId') : 'User ID'}:</Text>
          <Text style={styles.value}>{user?.id}</Text>
        </View>

        {/* Language Selector - Only for Farmers */}
        {user?.role === 'FARMER' && (
          <View style={styles.languageContainer}>
            <View style={styles.languageHeader}>
              <Ionicons name="language-outline" size={20} color="#2e7d32" />
              <Text style={styles.languageLabel}>{t('language')}</Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={language}
                onValueChange={handleLanguageChange}
                style={styles.picker}
              >
                <Picker.Item label="English" value="English" />
                <Picker.Item label="मराठी (Marathi)" value="Marathi" />
                <Picker.Item label="हिन्दी (Hindi)" value="Hindi" />
              </Picker>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{user?.role === 'FARMER' ? t('logout') : 'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  languageContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    width: '100%',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 60,
    justifyContent: 'center',
  },
  picker: {
    height: 60,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
