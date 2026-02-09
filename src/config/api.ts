import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend URL
// For local development: 'http://localhost:5000/api'
// For Android emulator: 'http://10.0.2.2:5000/api'
// For iOS simulator: 'http://localhost:5000/api'
export const API_BASE_URL = 'http://192.168.0.105:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    return Promise.reject(error);
  }
);

export default api;
