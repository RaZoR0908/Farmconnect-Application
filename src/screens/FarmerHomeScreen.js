import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import productService from '../services/productService';
import { uploadMultipleToCloudinary } from '../services/cloudinaryService';
import { getProductDisplayImage, getDefaultProductImage, getProductDetailImages } from '../utils/productImages';
import api from '../config/api';
import walletService from '../services/walletService';

// Common product names suggestions
const PRODUCT_SUGGESTIONS = {
  VEGETABLES: [
    'Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Cauliflower', 'Brinjal', 'Cucumber', 
    'Spinach', 'Lettuce', 'Peas', 'Beans', 'Radish', 'Beetroot', 'Capsicum', 'Bell Pepper',
    'Green Chili', 'Red Chili', 'Ginger', 'Garlic', 'Coriander', 'Mint', 'Fenugreek',
    'Pumpkin', 'Bottle Gourd', 'Bitter Gourd', 'Ridge Gourd', 'Snake Gourd', 'Lady Finger',
    'Drumstick', 'Cluster Beans', 'French Beans', 'Broad Beans', 'Sweet Potato', 'Yam',
    'Taro Root', 'Turnip', 'Parsnip', 'Celery', 'Leek', 'Spring Onion', 'Broccoli',
    'Zucchini', 'Kale', 'Bok Choy', 'Asparagus', 'Artichoke', 'Eggplant', 'Mushroom',
    'Baby Corn', 'Sweet Corn', 'Purple Cabbage', 'Chinese Cabbage', 'Kohlrabi'
  ],
  FRUITS: [
    'Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Papaya', 'Watermelon', 'Pineapple',
    'Pomegranate', 'Guava', 'Strawberry', 'Kiwi', 'Dragon Fruit', 'Lemon', 'Lime',
    'Sweet Lime', 'Grapefruit', 'Mandarin', 'Tangerine', 'Sapota', 'Custard Apple',
    'Jackfruit', 'Lychee', 'Longan', 'Passion Fruit', 'Avocado', 'Apricot', 'Peach',
    'Plum', 'Cherry', 'Pear', 'Persimmon', 'Fig', 'Dates', 'Coconut', 'Tender Coconut',
    'Mulberry', 'Blackberry', 'Raspberry', 'Blueberry', 'Cranberry', 'Gooseberry',
    'Wood Apple', 'Star Fruit', 'Kiwano', 'Rambutan', 'Durian', 'Mangosteen',
    'Cantaloupe', 'Honeydew', 'Muskmelon', 'Amla', 'Jamun', 'Bael Fruit'
  ],
  GRAINS: [
    'Rice', 'Wheat', 'Corn', 'Barley', 'Oats', 'Millet', 'Sorghum', 'Quinoa', 'Bajra',
    'Ragi', 'Jowar', 'Foxtail Millet', 'Pearl Millet', 'Finger Millet', 'Little Millet',
    'Kodo Millet', 'Barnyard Millet', 'Proso Millet', 'Brown Rice', 'White Rice',
    'Basmati Rice', 'Wild Rice', 'Red Rice', 'Black Rice', 'Whole Wheat', 'Durum Wheat',
    'Buckwheat', 'Amaranth', 'Teff', 'Spelt', 'Kamut', 'Farro', 'Bulgur', 'Couscous',
    'Semolina', 'Rye', 'Triticale', 'Flaxseed', 'Chia Seeds', 'Hemp Seeds'
  ],
  DAIRY: [
    'Milk', 'Butter', 'Cheese', 'Yogurt', 'Paneer', 'Ghee', 'Cream', 'Curd', 'Buttermilk',
    'Condensed Milk', 'Evaporated Milk', 'Whole Milk', 'Skim Milk', 'Toned Milk',
    'Double Toned Milk', 'Buffalo Milk', 'Cow Milk', 'Goat Milk', 'Sour Cream',
    'Cottage Cheese', 'Mozzarella', 'Cheddar', 'Parmesan', 'Feta', 'Ricotta', 'Gouda',
    'Brie', 'Camembert', 'Blue Cheese', 'Cream Cheese', 'Mascarpone', 'Whey Protein',
    'Milk Powder', 'Khoya', 'Rabri', 'Shrikhand', 'Lassi', 'Kefir', 'Whipped Cream'
  ],
  POULTRY: [
    'Chicken', 'Eggs', 'Duck', 'Turkey', 'Quail Eggs', 'Quail Meat', 'Duck Eggs',
    'Chicken Breast', 'Chicken Thigh', 'Chicken Wings', 'Chicken Drumstick', 'Whole Chicken',
    'Chicken Liver', 'Chicken Gizzard', 'Chicken Mince', 'Country Chicken', 'Broiler Chicken',
    'Free Range Chicken', 'Organic Chicken', 'Brown Eggs', 'White Eggs', 'Organic Eggs',
    'Free Range Eggs', 'Duck Meat', 'Turkey Breast', 'Turkey Whole', 'Goose', 'Guinea Fowl'
  ],
  OTHERS: [
    'Honey', 'Mushroom', 'Herbs', 'Spices', 'Nuts', 'Seeds', 'Almonds', 'Cashews',
    'Walnuts', 'Pistachios', 'Peanuts', 'Hazelnuts', 'Pecans', 'Macadamia', 'Brazil Nuts',
    'Pine Nuts', 'Sunflower Seeds', 'Pumpkin Seeds', 'Sesame Seeds', 'Poppy Seeds',
    'Cumin Seeds', 'Mustard Seeds', 'Fenugreek Seeds', 'Fennel Seeds', 'Caraway Seeds',
    'Black Pepper', 'White Pepper', 'Cardamom', 'Cinnamon', 'Cloves', 'Nutmeg', 'Mace',
    'Star Anise', 'Bay Leaf', 'Curry Leaf', 'Turmeric', 'Red Chili Powder', 'Coriander Powder',
    'Cumin Powder', 'Garam Masala', 'Chaat Masala', 'Oregano', 'Basil', 'Thyme', 'Rosemary',
    'Sage', 'Parsley', 'Dill', 'Tarragon', 'Vanilla', 'Saffron', 'Coffee', 'Tea',
    'Jaggery', 'Sugar', 'Brown Sugar', 'Rock Salt', 'Sea Salt', 'Pink Salt', 'Black Salt'
  ]
};

export default function FarmerHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'VEGETABLES',
    price: '',
    quantity: '',
    unit: 'KG',
    description: '',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadWallet();
  }, []);

  // Refresh wallet when screen comes into focus (after accepting/rejecting orders)
  useFocusEffect(
    React.useCallback(() => {
      loadWallet();
    }, [])
  );

  const loadProducts = async () => {
    setLoading(true);
    const result = await productService.getMyProducts();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.get('/orders/farmer');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      // Silent error
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      const result = await walletService.getBalance();
      if (result.success) {
        setWallet(result.data);
      }
    } catch (error) {
      // Silent error
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProducts(), loadOrders(), loadWallet()]);
    setRefreshing(false);
  };

  const handleNameChange = (text) => {
    setFormData({ ...formData, name: text });
    
    if (text.length > 0) {
      // Search across all categories
      let allSuggestions = [];
      let detectedCategory = formData.category;
      
      Object.keys(PRODUCT_SUGGESTIONS).forEach(category => {
        const matches = PRODUCT_SUGGESTIONS[category].filter(item => 
          item.toLowerCase().startsWith(text.toLowerCase())
        );
        
        if (matches.length > 0) {
          // Auto-detect category from first match
          if (allSuggestions.length === 0) {
            detectedCategory = category;
          }
          allSuggestions = [...allSuggestions, ...matches.map(item => ({ name: item, category }))];
        }
      });
      
      // Auto-set category if detected
      if (detectedCategory !== formData.category && allSuggestions.length > 0) {
        setFormData({ ...formData, name: text, category: detectedCategory });
      }
      
      setFilteredSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData({ ...formData, name: suggestion.name, category: suggestion.category });
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const pickImages = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photos to upload product images.');
        return;
      }

      // Check current image count
      if (selectedImages.length >= 5) {
        Alert.alert('Limit Reached', 'You can upload a maximum of 5 images per product.');
        return;
      }

      // Launch image picker with crop functionality
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageUri = result.assets[0].uri;
        setSelectedImages([...selectedImages, newImageUri]);
        Alert.alert('Success', 'Image added! Tap again to add more (max 5)');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to pick image: ${error.message || JSON.stringify(error)}`);
    }
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleAddProduct = async () => {
    if (!formData.name.trim() || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      let imageUrls = [];

      // Upload images to Cloudinary if any are selected
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          imageUrls = await uploadMultipleToCloudinary(
            selectedImages,
            (current, total) => {
              setUploadProgress({ current: current + 1, total });
            }
          );
        } catch (uploadError) {
          setLoading(false);
          setUploadingImages(false);
          Alert.alert('Upload Error', `Failed to upload images: ${uploadError.message}`);
          return;
        }
        setUploadingImages(false);
      }

      // Create product data with image URLs
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        image_urls: imageUrls,
      };

      const result = await productService.createProduct(productData);

      if (result.success) {
        Alert.alert('Success', 'Product added successfully!');
        setShowAddProduct(false);
        setFormData({
          name: '',
          category: 'VEGETABLES',
          price: '',
          quantity: '',
          unit: 'KG',
          description: '',
        });
        setSelectedImages([]);
        setUploadProgress({ current: 0, total: 0 });
        loadProducts();
      } else {
        Alert.alert('Error', result.message || 'Failed to create product');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to add product: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId, productName) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${productName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await productService.deleteProduct(productId);
            if (result.success) {
              Alert.alert('Success', 'Product deleted');
              loadProducts();
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit,
      description: product.description || '',
    });
    // Show existing images as preview (URLs from database)
    setSelectedImages(product.image_urls || []);
    setShowAddProduct(true);
  };

  const handleUpdateProduct = async () => {
    if (!formData.name.trim() || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);

    try {
      let imageUrls = [];

      // Check if user added new images (local file URIs start with file://)
      const newImages = selectedImages.filter(uri => uri.startsWith('file://'));
      const existingImages = selectedImages.filter(uri => !uri.startsWith('file://'));

      if (newImages.length > 0) {
        setUploadingImages(true);
        try {
          const newUrls = await uploadMultipleToCloudinary(
            newImages,
            (current, total) => {
              setUploadProgress({ current: current + 1, total });
            }
          );
          imageUrls = [...existingImages, ...newUrls];
        } catch (uploadError) {
          setLoading(false);
          setUploadingImages(false);
          Alert.alert('Upload Error', `Failed to upload images: ${uploadError.message}`);
          return;
        }
        setUploadingImages(false);
      } else {
        imageUrls = existingImages;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        image_urls: imageUrls,
      };

      const result = await productService.updateProduct(editingProduct.id, productData);

      if (result.success) {
        Alert.alert('Success', 'Product updated successfully!');
        setShowAddProduct(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          category: 'VEGETABLES',
          price: '',
          quantity: '',
          unit: 'KG',
          description: '',
        });
        setSelectedImages([]);
        setUploadProgress({ current: 0, total: 0 });
        loadProducts();
      } else {
        Alert.alert('Error', result.message || 'Failed to update product');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update product: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const closeProductModal = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'VEGETABLES',
      price: '',
      quantity: '',
      unit: 'KG',
      description: '',
    });
    setSelectedImages([]);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleImageScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / Dimensions.get('window').width);
    setCurrentImageIndex(index);
  };

  const renderDashboard = () => {
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const totalRevenue = orders
      .filter(o => o.status === 'ACCEPTED' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const inStockProducts = products.filter(p => p.quantity > 0).length;
    const lowStockProducts = products.filter(p => p.quantity < 10 && p.quantity > 0).length;

    return (
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.greeting}>Welcome, {user?.full_name}!</Text>
        <Text style={styles.subtitle}>Farmer Dashboard</Text>

        {/* Wallet Balance Card */}
        <TouchableOpacity 
          style={styles.walletCard}
          onPress={() => navigation.navigate('Wallet')}
        >
          <View style={styles.walletLeft}>
            <Ionicons name="wallet" size={28} color="#fff" />
            <View style={{marginLeft: 12}}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>₹{wallet ? parseFloat(wallet.balance).toFixed(2) : '0.00'}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigation.navigate('Products')}
          >
            <Ionicons name="cube-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
            <Text style={styles.statSubtext}>{inStockProducts} in stock</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#2196F3' }]}
            onPress={() => navigation.navigate('Orders')}
          >
            <Ionicons name="cart-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
            <Text style={styles.statSubtext}>Total received</Text>
          </TouchableOpacity>

          <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="time-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>{pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statSubtext}>Needs action</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
            <Ionicons name="trending-up-outline" size={32} color="#fff" />
            <Text style={styles.statValue}>₹{totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statSubtext}>From sales</Text>
          </View>
        </View>

        {/* Low Stock Alert */}
        {lowStockProducts > 0 && (
          <View style={styles.alertCard}>
            <Ionicons name="warning-outline" size={24} color="#ff9800" />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
              <Text style={styles.alertText}>{lowStockProducts} product(s) running low on stock</Text>
            </View>
          </View>
        )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowAddProduct(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#2e7d32" />
          <Text style={styles.actionText}>Add New Product</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Orders')}
        >
          <Ionicons name="receipt-outline" size={24} color="#2e7d32" />
          <Text style={styles.actionText}>Manage Orders</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Ionicons name="cube-outline" size={24} color="#2e7d32" />
          <Text style={styles.actionText}>View All Products</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Ionicons name="wallet-outline" size={24} color="#2e7d32" />
          <Text style={styles.actionText}>Wallet & Transactions</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

  const renderProducts = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddProduct(true)}
        >
          <Ionicons name="add-circle" size={32} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 40 }} />
        ) : products.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No products yet</Text>
            <Text style={styles.emptySubtext}>Start by adding your first product</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowAddProduct(true)}
            >
              <Text style={styles.primaryButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          products.map((product) => {
            const displayImage = getProductDisplayImage(product);
            const imageCount = product.image_urls?.length || 0;
            
            return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productRow}>
                {/* Product Image - Always show category emoji */}
                <View style={styles.productImageContainer}>
                  <View style={[styles.productDefaultImage, { backgroundColor: displayImage.color }]}>
                    <Text style={styles.productEmoji}>{displayImage.emoji}</Text>
                    {imageCount > 0 && (
                      <View style={styles.imageCountBadge}>
                        <Ionicons name="images" size={12} color="#fff" />
                        <Text style={styles.imageCountText}>{imageCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                {/* Product Info */}
                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productCategory}>{product.category}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <TouchableOpacity
                        onPress={() => handleEditProduct(product)}
                      >
                        <Ionicons name="pencil-outline" size={24} color="#2196F3" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteProduct(product.id, product.name)}
                      >
                        <Ionicons name="trash-outline" size={24} color="#f44336" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.productDetails}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productPrice}>₹{product.price}/{product.unit}</Text>
                      <Text style={styles.productStock}>Stock: {product.quantity} {product.unit}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => setViewingProduct(product)}
                    >
                      <Ionicons name="eye-outline" size={18} color="#2e7d32" />
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                  {product.description && (
                    <Text style={styles.productDescription}>{product.description}</Text>
                  )}
                </View>
              </View>
            </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );

  const renderOrders = () => {
    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const recentOrders = orders.slice(0, 5);

    return (
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('FarmerOrders')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={20} color="#2e7d32" />
          </TouchableOpacity>
        </View>

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {ordersLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#2e7d32" />
              <Text style={styles.emptySubtext}>Loading orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No orders yet</Text>
              <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
            </View>
          ) : (
            <>
              {pendingOrders.length > 0 && (
                <View style={styles.pendingAlert}>
                  <Ionicons name="alert-circle" size={24} color="#ff9800" />
                  <Text style={styles.pendingAlertText}>
                    You have {pendingOrders.length} pending order{pendingOrders.length > 1 ? 's' : ''} waiting for your response!
                  </Text>
                </View>
              )}

              <View style={styles.ordersSummary}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{pendingOrders.length}</Text>
                  <Text style={styles.summaryLabel}>Pending</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {orders.filter(o => o.status === 'ACCEPTED').length}
                  </Text>
                  <Text style={styles.summaryLabel}>Accepted</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {orders.filter(o => o.status === 'REJECTED').length}
                  </Text>
                  <Text style={styles.summaryLabel}>Rejected</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.manageOrdersButton}
                onPress={() => navigation.navigate('FarmerOrders')}
              >
                <Ionicons name="receipt" size={24} color="#fff" />
                <Text style={styles.manageOrdersText}>Manage All Orders</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Recent Orders</Text>
              {recentOrders.map(order => (
                <View key={order.id} style={styles.orderPreviewCard}>
                  <View style={styles.orderPreviewHeader}>
                    <Text style={styles.orderPreviewProduct}>{order.product?.name}</Text>
                    <View style={[styles.orderPreviewStatus, { 
                      backgroundColor: order.status === 'PENDING' ? '#ff9800' : 
                                       order.status === 'ACCEPTED' ? '#4caf50' : '#f44336' 
                    }]}>
                      <Text style={styles.orderPreviewStatusText}>{order.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderPreviewBuyer}>{order.buyer?.full_name}</Text>
                  <View style={styles.orderPreviewFooter}>
                    <Text style={styles.orderPreviewQuantity}>
                      {order.quantity} {order.product?.unit}
                    </Text>
                    <Text style={styles.orderPreviewAmount}>₹{order.total_amount.toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Content - Show Dashboard */}
      {renderDashboard()}

      {/* Add Product Modal */}
      <Modal
        visible={showAddProduct}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeProductModal}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Start typing product name..."
                value={formData.name}
                onChangeText={handleNameChange}
                autoCapitalize="words"
              />
              {showSuggestions && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView style={styles.suggestionsList} nestedScrollEnabled>
                    {filteredSuggestions.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectSuggestion(item)}
                      >
                        <Ionicons name="leaf-outline" size={16} color="#2e7d32" />
                        <Text style={styles.suggestionText}>{item.name}</Text>
                        <Text style={styles.suggestionCategory}>{item.category}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category * (Auto-detected)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.category}
                  onValueChange={(value) => {
                    setFormData({ ...formData, category: value });
                    setShowSuggestions(false);
                  }}
                >
                  <Picker.Item label="Vegetables" value="VEGETABLES" />
                  <Picker.Item label="Fruits" value="FRUITS" />
                  <Picker.Item label="Grains" value="GRAINS" />
                  <Picker.Item label="Dairy" value="DAIRY" />
                  <Picker.Item label="Poultry" value="POULTRY" />
                  <Picker.Item label="Others" value="OTHERS" />
                </Picker>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Unit *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <Picker.Item label="Kilogram (KG)" value="KG" />
                  <Picker.Item label="Gram (G)" value="G" />
                  <Picker.Item label="Liter (L)" value="L" />
                  <Picker.Item label="Piece (PCS)" value="PCS" />
                  <Picker.Item label="Dozen (DZ)" value="DZ" />
                  <Picker.Item label="Quintal (QTL)" value="QTL" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter product description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Product Images Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Product Images (Optional - Max 5)</Text>
              
              {/* Selected Images Grid */}
              {selectedImages.length > 0 && (
                <View style={styles.imagesGrid}>
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} style={styles.imagePreviewWrapper}>
                      <Image 
                        source={{ uri: imageUri }} 
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                      <TouchableOpacity 
                        style={styles.removeImageBtn}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#f44336" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Add Image Button */}
              {selectedImages.length < 5 && (
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={pickImages}
                >
                  <Ionicons name="camera-outline" size={32} color="#2e7d32" />
                  <Text style={styles.addImageText}>
                    {selectedImages.length === 0 ? 'Add Product Photos' : `Add More (${selectedImages.length}/5)`}
                  </Text>
                  <Text style={styles.addImageSubtext}>
                    📸 Add photos to attract more buyers
                  </Text>
                </TouchableOpacity>
              )}

              {uploadingImages && (
                <View style={styles.uploadProgressContainer}>
                  <ActivityIndicator size="small" color="#2e7d32" />
                  <Text style={styles.uploadProgressText}>
                    Uploading image {uploadProgress.current} of {uploadProgress.total}...
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (loading || uploadingImages) && styles.submitButtonDisabled]}
              onPress={editingProduct ? handleUpdateProduct : handleAddProduct}
              disabled={loading || uploadingImages}
            >
              {loading || uploadingImages ? (
                <View style={styles.submitButtonContent}>
                  <ActivityIndicator color="#fff" />
                  <Text style={[styles.submitButtonText, { marginLeft: 10 }]}>
                    {uploadingImages ? 'Uploading Images...' : (editingProduct ? 'Updating Product...' : 'Adding Product...')}
                  </Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* View Product Details Modal */}
      <Modal
        visible={viewingProduct !== null}
        animationType="slide"
        transparent={false}
        onShow={() => setCurrentImageIndex(0)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setViewingProduct(null)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Product Details</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {viewingProduct && (
              <>
                {/* Image Gallery */}
                {viewingProduct.image_urls && viewingProduct.image_urls.length > 0 ? (
                  <View style={styles.imageGallery}>
                    <ScrollView 
                      horizontal 
                      pagingEnabled 
                      showsHorizontalScrollIndicator={false}
                      onScroll={handleImageScroll}
                      scrollEventThrottle={16}
                      snapToInterval={Dimensions.get('window').width}
                      decelerationRate="fast"
                      bounces={false}
                    >
                      {viewingProduct.image_urls.map((imageUrl, index) => (
                        <View key={index} style={styles.galleryImageContainer}>
                          <Image
                            source={{ uri: imageUrl }}
                            style={styles.galleryImage}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </ScrollView>
                    
                    {/* Image indicators (dots) */}
                    {viewingProduct.image_urls.length > 1 && (
                      <View style={styles.imageIndicators}>
                        {viewingProduct.image_urls.map((_, index) => (
                          <View
                            key={index}
                            style={[
                              styles.indicator,
                              currentImageIndex === index && styles.activeIndicator
                            ]}
                          />
                        ))}
                      </View>
                    )}
                    
                    {/* Image counter */}
                    <View style={styles.imageCounter}>
                      <Text style={styles.imageCounterText}>
                        {currentImageIndex + 1} / {viewingProduct.image_urls.length}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.noImageContainer, { backgroundColor: getDefaultProductImage(viewingProduct.category).color }]}>
                    <Text style={styles.noImageEmoji}>
                      {getDefaultProductImage(viewingProduct.category).emoji}
                    </Text>
                  </View>
                )}

                {/* Product Info */}
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsProductName}>{viewingProduct.name}</Text>
                  <Text style={styles.detailsCategory}>{viewingProduct.category}</Text>

                  <View style={styles.detailsRow}>
                    <Ionicons name="pricetag-outline" size={20} color="#2e7d32" />
                    <Text style={styles.detailsPrice}>₹{viewingProduct.price}/{viewingProduct.unit}</Text>
                  </View>

                  <View style={styles.detailsRow}>
                    <Ionicons name="cube-outline" size={20} color="#2196F3" />
                    <Text style={styles.detailsStock}>Stock: {viewingProduct.quantity} {viewingProduct.unit}</Text>
                  </View>

                  {viewingProduct.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionLabel}>Description:</Text>
                      <Text style={styles.descriptionText}>{viewingProduct.description}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setViewingProduct(null);
                      handleEditProduct(viewingProduct);
                    }}
                  >
                    <Ionicons name="pencil" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>Edit Product</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2e7d32',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  statCard: {
    width: '50%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.7,
    marginTop: 2,
  },
  walletCard: {
    backgroundColor: '#2e7d32',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  walletAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#664d03',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#664d03',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  productCategory: {
    fontSize: 13,
    color: '#666',
  },
  productDetails: {
    marginTop: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 3,
  },
  productStock: {
    fontSize: 13,
    color: '#666',
  },
  productDescription: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  suggestionCategory: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  // Product Image Styles
  productRow: {
    flexDirection: 'row',
  },
  productImageContainer: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productEmojiContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
  },
  productEmoji: {
    fontSize: 35,
  },
  productInfo: {
    flex: 1,
  },
  // Image Upload Styles
  uploadButton: {
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f9fdf9',
  },
  uploadText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
    marginTop: 8,
  },
  // Product card with image
  productRow: {
    flexDirection: 'row',
    gap: 10,
  },
  productImageContainer: {
    width: 70,
    height: 70,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  productDefaultImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 35,
  },
  productInfo: {
    flex: 1,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Image upload UI
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  imagePreviewWrapper: {
    width: '30%',
    aspectRatio: 1,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f1f8f4',
  },
  addImageText: {
    color: '#2e7d32',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 16,
  },
  addImageSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  uploadProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginTop: 10,
  },
  uploadProgressText: {
    marginLeft: 10,
    color: '#2e7d32',
    fontWeight: '500',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  viewButtonText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  imageGallery: {
    height: 300,
    backgroundColor: '#000',
    marginBottom: 20,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -16,
    width: Dimensions.get('window').width,
  },
  galleryImageContainer: {
    width: Dimensions.get('window').width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 24,
  },
  noImageContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -16,
    marginRight: -16,
    marginTop: -16,
  },
  noImageEmoji: {
    fontSize: 80,
  },
  detailsContainer: {
    padding: 20,
  },
  detailsProductName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailsCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  detailsPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  detailsStock: {
    fontSize: 16,
    color: '#666',
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewAllText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  pendingAlert: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  pendingAlertText: {
    flex: 1,
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
  },
  ordersSummary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  manageOrdersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  manageOrdersText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  orderPreviewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderPreviewProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  orderPreviewStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderPreviewStatusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderPreviewBuyer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  orderPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderPreviewQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderPreviewAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});