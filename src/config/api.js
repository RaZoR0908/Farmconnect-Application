import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Automatically detect the correct API URL based on platform
// For local development:
// - Android emulator: 'http://10.0.2.2:5000/api'
// - iOS simulator: 'http://localhost:5000/api'
// - Physical device: Use your computer's IP address (e.g., 'http://192.168.0.105:5000/api')

const getApiBaseUrl = () => {
  // For physical device, use your computer's IP address
  // Make sure your phone and computer are on the same WiFi network
  const PHYSICAL_DEVICE_IP = 'http://192.168.0.105:5000/api';
  
  if (__DEV__) {
    // Uncomment the line below if using a physical device
    return PHYSICAL_DEVICE_IP;
    
    // Use these for emulators/simulators (comment out the return above)
    // if (Platform.OS === 'android') {
    //   return 'http://10.0.2.2:5000/api'; // Android emulator
    // } else {
    //   return 'http://localhost:5000/api'; // iOS simulator
    // }
  }
  // Production - update this with your production API URL
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }
    
    // Enhanced error messages
    if (!error.response) {
      error.message = 'Network error: Cannot connect to server. Please check if the backend is running.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
