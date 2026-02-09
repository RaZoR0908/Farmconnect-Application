import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to FarmConnect!</Text>
        <Text style={styles.userInfo}>Hello, {user?.full_name}</Text>
        <Text style={styles.roleText}>Role: {user?.role}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Getting Started</Text>
        <Text style={styles.infoText}>
          You're successfully logged in! This is your home screen.
        </Text>
        <Text style={styles.infoText}>
          Connect with farmers, browse products, and manage orders all in one place.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomeContainer: {
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 10,
  },
});
