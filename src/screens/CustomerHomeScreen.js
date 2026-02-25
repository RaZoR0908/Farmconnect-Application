import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Keyboard,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import walletService from '../services/walletService';
import { getDefaultProductImage, getProductEmoji } from '../utils/productImages';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🌾' },
  { id: 'FRUITS', name: 'Fruits', icon: '🍎' },
  { id: 'VEGETABLES', name: 'Vegetables', icon: '🥕' },
  { id: 'GRAINS', name: 'Grains', icon: '🌾' },
  { id: 'DAIRY', name: 'Dairy', icon: '🥛' },
  { id: 'MEAT', name: 'Meat', icon: '🍖' },
  { id: 'HERBS', name: 'Herbs', icon: '🌿' },
  { id: 'OTHER', name: 'Other', icon: '📦' },
];

// Predefined product names that should always appear in search suggestions
const ALL_PRODUCT_NAMES = [
  // Fruits
  { name: 'Apple', category: 'FRUITS' },
  { name: 'Banana', category: 'FRUITS' },
  { name: 'Orange', category: 'FRUITS' },
  { name: 'Mango', category: 'FRUITS' },
  { name: 'Grapes', category: 'FRUITS' },
  { name: 'Watermelon', category: 'FRUITS' },
  { name: 'Papaya', category: 'FRUITS' },
  { name: 'Pineapple', category: 'FRUITS' },
  { name: 'Guava', category: 'FRUITS' },
  { name: 'Pomegranate', category: 'FRUITS' },
  { name: 'Strawberry', category: 'FRUITS' },
  { name: 'Blueberry', category: 'FRUITS' },
  { name: 'Kiwi', category: 'FRUITS' },
  { name: 'Lemon', category: 'FRUITS' },
  { name: 'Lime', category: 'FRUITS' },
  { name: 'Peach', category: 'FRUITS' },
  { name: 'Plum', category: 'FRUITS' },
  { name: 'Cherry', category: 'FRUITS' },
  { name: 'Pear', category: 'FRUITS' },
  { name: 'Avocado', category: 'FRUITS' },
  
  // Vegetables
  { name: 'Tomato', category: 'VEGETABLES' },
  { name: 'Potato', category: 'VEGETABLES' },
  { name: 'Onion', category: 'VEGETABLES' },
  { name: 'Carrot', category: 'VEGETABLES' },
  { name: 'Cabbage', category: 'VEGETABLES' },
  { name: 'Cauliflower', category: 'VEGETABLES' },
  { name: 'Broccoli', category: 'VEGETABLES' },
  { name: 'Spinach', category: 'VEGETABLES' },
  { name: 'Lettuce', category: 'VEGETABLES' },
  { name: 'Cucumber', category: 'VEGETABLES' },
  { name: 'Bell Pepper', category: 'VEGETABLES' },
  { name: 'Green Chili', category: 'VEGETABLES' },
  { name: 'Eggplant', category: 'VEGETABLES' },
  { name: 'Pumpkin', category: 'VEGETABLES' },
  { name: 'Beetroot', category: 'VEGETABLES' },
  { name: 'Radish', category: 'VEGETABLES' },
  { name: 'Green Beans', category: 'VEGETABLES' },
  { name: 'Peas', category: 'VEGETABLES' },
  { name: 'Corn', category: 'VEGETABLES' },
  { name: 'Okra', category: 'VEGETABLES' },
  
  // Grains
  { name: 'Rice', category: 'GRAINS' },
  { name: 'Wheat', category: 'GRAINS' },
  { name: 'Barley', category: 'GRAINS' },
  { name: 'Oats', category: 'GRAINS' },
  { name: 'Corn', category: 'GRAINS' },
  { name: 'Millet', category: 'GRAINS' },
  { name: 'Quinoa', category: 'GRAINS' },
  { name: 'Sorghum', category: 'GRAINS' },
  
  // Dairy
  { name: 'Milk', category: 'DAIRY' },
  { name: 'Butter', category: 'DAIRY' },
  { name: 'Cheese', category: 'DAIRY' },
  { name: 'Yogurt', category: 'DAIRY' },
  { name: 'Cream', category: 'DAIRY' },
  { name: 'Paneer', category: 'DAIRY' },
  { name: 'Ghee', category: 'DAIRY' },
  
  // Meat
  { name: 'Chicken', category: 'MEAT' },
  { name: 'Mutton', category: 'MEAT' },
  { name: 'Beef', category: 'MEAT' },
  { name: 'Pork', category: 'MEAT' },
  { name: 'Fish', category: 'MEAT' },
  { name: 'Eggs', category: 'MEAT' },
  
  // Herbs
  { name: 'Coriander', category: 'HERBS' },
  { name: 'Mint', category: 'HERBS' },
  { name: 'Basil', category: 'HERBS' },
  { name: 'Curry Leaves', category: 'HERBS' },
  { name: 'Parsley', category: 'HERBS' },
  { name: 'Thyme', category: 'HERBS' },
  { name: 'Rosemary', category: 'HERBS' },
  { name: 'Oregano', category: 'HERBS' },
];

export default function CustomerHomeScreen({ navigation }) {
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  
  // Initialize with all predefined product names
  const [allProductNames, setAllProductNames] = useState(() => {
    const nameMap = new Map();
    ALL_PRODUCT_NAMES.forEach(item => {
      nameMap.set(item.name.toLowerCase(), {
        name: item.name,
        category: item.category,
      });
    });
    return nameMap;
  });

  useEffect(() => {
    loadProducts();
    loadWallet();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      
      // Merge farmer-added products with predefined product names
      setAllProductNames(prevNames => {
        const updatedNames = new Map(prevNames);
        data.forEach(p => {
          const nameLower = p.name.toLowerCase();
          // Add or update with farmer's product info
          updatedNames.set(nameLower, {
            name: p.name,
            category: p.category,
          });
        });
        return updatedNames;
      });
    } catch (error) {
      // Error loading products
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      const result = await walletService.getBalance();
      if (result.success) {
        setWallet(result.data);
      }
    } catch (error) {
      // Error loading wallet
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProducts(), loadWallet()]);
    setRefreshing(false);
  };

  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };

  const handleAddMoneySubmit = async () => {
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setProcessingPayment(true);
    try {
      const result = await walletService.addMoney(parseFloat(addMoneyAmount));
      
      if (result.success) {
        Alert.alert('Success', `₹${addMoneyAmount} added to your wallet successfully!`);
        setShowAddMoneyModal(false);
        setAddMoneyAmount('');
        loadWallet();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add money');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Use useMemo to filter products without causing re-renders
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.farmer?.full_name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  // Get search suggestions from stored product names (top 8 unique matches)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const suggestions = [];
    
    // Search through all stored product names
    for (const [nameLower, productInfo] of allProductNames.entries()) {
      if (nameLower.includes(query) || productInfo.category.toLowerCase().includes(query)) {
        suggestions.push(productInfo);
      }
    }

    // Return top 8 matches
    return suggestions.slice(0, 8);
  }, [allProductNames, searchQuery]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setShowSuggestions(text.length >= 2);
  };

  const handleSuggestionPress = (productInfo) => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    
    // Find if this product is currently available
    const availableProduct = products.find(
      p => p.name.toLowerCase() === productInfo.name.toLowerCase()
    );
    
    if (availableProduct) {
      navigation.navigate('ProductDetail', { product: availableProduct });
    } else {
      Alert.alert(
        'Not Available',
        `${productInfo.name} is currently not available in stock.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowSuggestions(false);
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setShowCartModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (selectedProduct && modalQuantity > 0) {
      addToCart(selectedProduct, modalQuantity);
      setShowCartModal(false);
      setSelectedProduct(null);
      setModalQuantity(1);
    }
  };

  const handleModalQuantityChange = (newQuantity) => {
    const qty = parseInt(newQuantity) || 1;
    if (qty > selectedProduct?.quantity) {
      Alert.alert('Stock Limit', `Only ${selectedProduct.quantity} ${selectedProduct.unit} available`);
      return;
    }
    if (qty < 1) {
      setModalQuantity(1);
      return;
    }
    setModalQuantity(qty);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Wallet Balance Card */}
      <TouchableOpacity 
        style={styles.walletCard}
        onPress={() => navigation.navigate('Wallet')}
        activeOpacity={0.8}
      >
        <View style={styles.walletLeft}>
          <Ionicons name="wallet" size={24} color="#fff" />
          <View style={{marginLeft: 12}}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>₹{wallet ? parseFloat(wallet.balance).toFixed(2) : '0.00'}</Text>
          </View>
        </View>
        <View style={styles.walletRight}>
          <Text style={styles.addMoneyText}>View Details</Text>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
        </Text>
        {(searchQuery || selectedCategory !== 'all') && (
          <TouchableOpacity
            onPress={() => {
              handleSearchClear();
              handleCategorySelect('all');
            }}
          >
            <Text style={styles.clearFilters}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderProductCard = ({ item }) => {
    // Get specific product emoji based on name
    const productEmoji = getProductEmoji(item.name, item.category);
    const displayPrice = item.pricing?.yourPrice || item.price;
    const hasDiscount = item.pricing?.discount > 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        {/* Product Image - Always show emoji, never farmer images on card */}
        <View style={[styles.productImagePlaceholder, { backgroundColor: productEmoji.color }]}>
          <Text style={styles.productImageEmoji}>{productEmoji.emoji}</Text>
        </View>

        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.pricing.discount}% OFF</Text>
          </View>
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          
          {/* Farmer Info */}
          <View style={styles.farmerInfo}>
            <Ionicons name="person-outline" size={12} color="#666" />
            <Text style={styles.farmerName} numberOfLines={1}>
              {item.farmer?.full_name || 'Unknown'}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.productPrice}>₹{displayPrice}/{item.unit}</Text>
              {hasDiscount && (
                <Text style={styles.originalPrice}>₹{item.price}/{item.unit}</Text>
              )}
            </View>
          </View>

          {/* Stock Info */}
          <Text style={styles.stockText}>
            {item.quantity > 0 ? `${item.quantity} ${item.unit} available` : 'Out of stock'}
          </Text>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[styles.addToCartBtn, item.quantity === 0 && styles.addToCartBtnDisabled]}
            onPress={() => handleAddToCart(item)}
            disabled={item.quantity === 0}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <Text style={styles.addToCartText}>
              {item.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📦</Text>
      <Text style={styles.emptyText}>No products found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Try adjusting your search' : 'Check back later for new products'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header with Search */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.full_name}! 👋</Text>
            <Text style={styles.subGreeting}>Find fresh products</Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={28} color="#2e7d32" />
            {getCartItemCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, farmers..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor="#999"
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleSearchClear}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <View style={styles.suggestionsDropdown}>
              <ScrollView 
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              >
                {searchSuggestions.map((productInfo) => {
                  const productEmoji = getProductEmoji(productInfo.name, productInfo.category);
                  return (
                    <TouchableOpacity
                      key={productInfo.name}
                      style={styles.suggestionItem}
                      onPress={() => handleSuggestionPress(productInfo)}
                    >
                      <Text style={styles.suggestionEmoji}>{productEmoji.emoji}</Text>
                      <Text style={styles.suggestionName} numberOfLines={1}>
                        {productInfo.name}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#999" />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => setShowSuggestions(false)}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2e7d32']}
          />
        }
      />

      {/* Add to Cart Modal */}
      <Modal
        visible={showCartModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add to Cart</Text>
                  <TouchableOpacity onPress={() => setShowCartModal(false)}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Product Info */}
                <View style={styles.modalProductInfo}>
                  <View style={[styles.modalProductIcon, { backgroundColor: getProductEmoji(selectedProduct.name, selectedProduct.category).color }]}>
                    <Text style={styles.modalProductEmoji}>
                      {getProductEmoji(selectedProduct.name, selectedProduct.category).emoji}
                    </Text>
                  </View>
                  <View style={styles.modalProductDetails}>
                    <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                    <Text style={styles.modalProductPrice}>₹{selectedProduct.pricing?.yourPrice || selectedProduct.price}/{selectedProduct.unit}</Text>
                  </View>
                </View>

                {/* Quantity Selector */}
                <View style={styles.quantitySection}>
                  <Text style={styles.quantityLabel}>Quantity ({selectedProduct.unit})</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => handleModalQuantityChange(modalQuantity - 1)}
                      disabled={modalQuantity <= 1}
                    >
                      <Ionicons name="remove" size={20} color={modalQuantity <= 1 ? '#ccc' : '#2e7d32'} />
                    </TouchableOpacity>
                    
                    <TextInput
                      style={styles.quantityInput}
                      value={modalQuantity.toString()}
                      onChangeText={handleModalQuantityChange}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                    
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => handleModalQuantityChange(modalQuantity + 1)}
                      disabled={modalQuantity >= selectedProduct.quantity}
                    >
                      <Ionicons name="add" size={20} color={modalQuantity >= selectedProduct.quantity ? '#ccc' : '#2e7d32'} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.stockInfo}>
                    {selectedProduct.quantity} {selectedProduct.unit} available
                  </Text>
                </View>

                {/* Total Price */}
                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total Price</Text>
                  <Text style={styles.totalPrice}>
                    ₹{((selectedProduct.pricing?.yourPrice || selectedProduct.price) * modalQuantity).toFixed(2)}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setShowCartModal(false)}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.modalConfirmBtn}
                    onPress={handleConfirmAddToCart}
                  >
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.modalConfirmText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Money Modal */}
      <Modal
        visible={showAddMoneyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddMoneyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: 32 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Money to Wallet</Text>
              <TouchableOpacity onPress={() => setShowAddMoneyModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.quantityLabel}>Enter Amount</Text>
            <TextInput
              style={styles.quantityInput}
              placeholder="₹ 0.00"
              keyboardType="numeric"
              value={addMoneyAmount}
              onChangeText={setAddMoneyAmount}
            />

            {/* Quick Amount Buttons */}
            <Text style={styles.quantityLabel}>Quick Add</Text>
            <View style={styles.quickAmountContainer}>
              {[100, 500, 1000, 2000, 5000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => setAddMoneyAmount(amount.toString())}
                >
                  <Text style={styles.quickAmountText}>₹{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.noteText}>
              💡 Test mode: Money will be added instantly
            </Text>

            <TouchableOpacity
              style={[styles.modalConfirmBtn, processingPayment && {opacity: 0.6}]}
              onPress={handleAddMoneySubmit}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="card" size={20} color="#fff" />
                  <Text style={styles.modalConfirmText}>Add Money</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  fixedHeader: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  walletCard: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  walletAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  walletRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addMoneyText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    marginRight: 6,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  quickAmountButton: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  quickAmountText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchWrapper: {
    marginBottom: 16,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
  },
  suggestionsList: {
    maxHeight: 320,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  suggestionEmoji: {
    fontSize: 24,
  },
  suggestionName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 12,
    marginTop: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#2e7d32',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearFilters: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    paddingHorizontal: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: (Dimensions.get('window').width - 36) / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#e0e0e0',
  },
  productImagePlaceholder: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageEmoji: {
    fontSize: 50,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    height: 36,
  },
  productCategory: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  farmerName: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  stockText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  addToCartBtn: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addToCartBtnDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modalProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  modalProductIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalProductEmoji: {
    fontSize: 32,
  },
  modalProductDetails: {
    flex: 1,
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  modalProductPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    width: 100,
    height: 50,
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 16,
    color: '#1a1a1a',
  },
  stockInfo: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalConfirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
