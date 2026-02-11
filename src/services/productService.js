import api from '../config/api';

const productService = {
  // Get all farmer's products
  getMyProducts: async () => {
    try {
      const response = await api.get('/products/farmer/my-products');
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products',
      };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      // Ensure image_url is included in the request
      const response = await api.post('/products', {
        ...productData,
        image_url: productData.image_url || '',
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create product',
      };
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, {
        ...productData,
        image_url: productData.image_url || '',
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update product',
      };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete product',
      };
    }
  },
};

export default productService;
