import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { getProductEmoji } from '../utils/productImages';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productEmoji = getProductEmoji(product.name, product.category);
  const displayPrice = product.pricing?.yourPrice || product.price;
  const hasDiscount = product.pricing?.discount > 0;

  const handleImageScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / Dimensions.get('window').width);
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (newQuantity) => {
    const qty = parseInt(newQuantity) || 1;
    if (qty > product.quantity) {
      Alert.alert('Stock Limit', `Only ${product.quantity} ${product.unit} available`);
      return;
    }
    if (qty < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(qty);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        {product.image_urls && product.image_urls.length > 0 ? (
          <View style={styles.imageContainer}>
            {/* Farmer Images Label */}
            <View style={styles.imageLabel}>
              <Ionicons name="images-outline" size={16} color="#fff" />
              <Text style={styles.imageLabelText}>Farmer's Uploaded Images</Text>
            </View>
            
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleImageScroll}
              scrollEventThrottle={16}
              snapToInterval={Dimensions.get('window').width}
              decelerationRate="fast"
            >
              {product.image_urls.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            {product.image_urls.length > 1 && (
              <View style={styles.imageIndicators}>
                {product.image_urls.map((_, index) => (
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

            {/* Image Counter */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {product.image_urls.length}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: productEmoji.color }]}>
            <Text style={styles.imagePlaceholderEmoji}>{productEmoji.emoji}</Text>
          </View>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadgeContainer}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {product.pricing.discount}% OFF - Save ₹{product.pricing.savings.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCategory}>{product.category}</Text>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>₹{displayPrice}</Text>
              <Text style={styles.priceUnit}>/{product.unit}</Text>
            </View>
            {hasDiscount && (
              <Text style={styles.originalPrice}>₹{product.price}/{product.unit}</Text>
            )}
          </View>

          {/* Stock Info */}
          <View style={styles.stockRow}>
            <Ionicons
              name={product.quantity > 0 ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={product.quantity > 0 ? '#4caf50' : '#f44336'}
            />
            <Text style={[
              styles.stockText,
              product.quantity === 0 && styles.outOfStockText
            ]}>
              {product.quantity > 0
                ? `${product.quantity} ${product.unit} available`
                : 'Out of stock'}
            </Text>
          </View>

          {/* Farmer Info */}
          <View style={styles.farmerCard}>
            <Ionicons name="person-circle-outline" size={24} color="#2e7d32" />
            <View style={styles.farmerInfo}>
              <Text style={styles.farmerLabel}>Sold by</Text>
              <Text style={styles.farmerName}>{product.farmer?.full_name || 'Unknown Farmer'}</Text>
              {product.farmer?.phone && (
                <Text style={styles.farmerContact}>{product.farmer.phone}</Text>
              )}
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* Quantity Selector */}
          {product.quantity > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => handleQuantityChange(quantity - 1)}
                >
                  <Ionicons name="remove" size={24} color="#2e7d32" />
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity.toString()}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => handleQuantityChange(quantity + 1)}
                >
                  <Ionicons name="add" size={24} color="#2e7d32" />
                </TouchableOpacity>
                <Text style={styles.quantityUnit}>{product.unit}</Text>
              </View>
            </View>
          )}

          {/* Order Summary */}
          {product.quantity > 0 && (
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ₹{(displayPrice * quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      {product.quantity > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₹{(displayPrice * quantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart" size={22} color="#fff" />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 350,
    backgroundColor: '#000',
  },
  imageLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  imageLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productImage: {
    width: Dimensions.get('window').width,
    height: 350,
  },
  imagePlaceholder: {
    width: Dimensions.get('window').width,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderEmoji: {
    fontSize: 100,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
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
  imageCounter: {
    position: 'absolute',
    bottom: 20,
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
  discountBadgeContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  discountBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountText: {
    color: '#856404',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  priceUnit: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    color: '#666',
  },
  outOfStockText: {
    color: '#f44336',
    fontWeight: '600',
  },
  farmerCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerLabel: {
    fontSize: 12,
    color: '#666',
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  farmerContact: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityInput: {
    width: 80,
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  quantityUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  orderSummary: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  addToCartButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
