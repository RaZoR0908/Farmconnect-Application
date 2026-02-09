import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  full_name: string;
  role: 'FARMER' | 'WHOLESALER' | 'RETAILER' | 'CUSTOMER' | 'INSTITUTIONAL_BUYER';
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  data?: any;
  message?: string;
}

class AuthService {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', loginData);
      
      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', registerData);
      
      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  }

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  async getStoredUser(): Promise<any | null> {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}

export default new AuthService();
