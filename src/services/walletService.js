import api from '../config/api';

const walletService = {
  // Get wallet balance
  getBalance: async () => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get wallet transactions
  getTransactions: async (limit = 50, offset = 0, type = null) => {
    try {
      const params = new URLSearchParams({ limit, offset });
      if (type) params.append('type', type);
      
      const response = await api.get(`/wallet/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add money to wallet
  addMoney: async (amount, paymentMethod = 'UPI') => {
    try {
      const response = await api.post('/wallet/add-money', {
        amount,
        payment_method: paymentMethod
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default walletService;
