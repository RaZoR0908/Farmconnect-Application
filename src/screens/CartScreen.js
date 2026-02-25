import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductEmoji } from '../utils/productImages';
import api from '../config/api';
import walletService from '../services/walletService';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const handleQuantityChange = (item, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    if (quantity > item.quantity) {
      Alert.alert('Stock Limit', `Only ${item.quantity} ${item.unit} available`);
      return;
    }
    updateQuantity(item.id, quantity);
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id) },
      ]
    );
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before placing order');
      return;
    }

    const totalAmount = getCartTotal();

    // Check wallet balance
    try {
      const result = await walletService.getBalance();
      if (result.success) {
        const walletBalance = parseFloat(result.data.balance) || 0;
        
        if (walletBalance < totalAmount) {
          Alert.alert(
            'Insufficient Wallet Balance',
            `Your wallet balance is ₹${walletBalance.toFixed(2)}, but order total is ₹${totalAmount.toFixed(2)}. Please add money to your wallet.`,
            [
              { text: 'Add Money', onPress: () => navigation.navigate('Wallet') },
              { text: 'Cancel' }
            ]
          );
          return;
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not check wallet balance. Please try again.');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Place order for ${cart.length} item(s) with total of ₹${totalAmount.toFixed(2)}?\n\nPayment will be deducted from your wallet.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: confirmPlaceOrder }
      ]
    );
  };

  const confirmPlaceOrder = async () => {
    try {
      setPlacing(true);
      
      // Create orders for each item (wallet payment)
      const orderPromises = cart.map(item => {
        const price = item.pricing?.yourPrice || item.price;
        return api.post('/orders', {
          product_id: item.id,
          quantity: item.quantity,
          payment_method: 'WALLET',
        });
      });

      await Promise.all(orderPromises);

      Alert.alert(
        'Success',
        'Your order has been placed successfully!\nPayment has been deducted from your wallet.',
        [{ text: 'OK', onPress: () => {
          clearCart();
          navigation.navigate('Orders');
        }}]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentModalVisible(false);
    // Payment method selection handler (currently using wallet-only flow)
  };

  const renderCartItem = ({ item }) => {
    const productEmoji = getProductEmoji(item.name, item.category);
    const price = item.pricing?.yourPrice || item.price;
    const itemTotal = price * item.quantity;

    return (
      <View style={styles.cartItem}>
        {/* Product Icon - Always show specific emoji */}
        <View style={[styles.itemImagePlaceholder, { backgroundColor: productEmoji.color }]}>
          <Text style={styles.itemImageEmoji}>{productEmoji.emoji}</Text>
        </View>

        {/* Product Info */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemFarmer}>by {item.farmer?.full_name || 'Unknown'}</Text>
          <Text style={styles.itemPrice}>₹{price}/{item.unit}</Text>
          
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={20} color="#2e7d32" />
            </TouchableOpacity>
            
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={20} color="#2e7d32" />
            </TouchableOpacity>
            
            <Text style={styles.unitText}> {item.unit.toUpperCase()}</Text>
          </View>
        </View>

        {/* Total & Remove */}
        <View style={styles.itemActions}>
          <Text style={styles.itemTotal}>₹{itemTotal.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveItem(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add some products to get started</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyCart()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cart.length})</Text>
              <Text style={styles.summaryValue}>₹{getCartTotal().toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{getCartTotal().toFixed(2)}</Text>
            </View>
          </View>
        }
      />

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutTotal}>₹{getCartTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, placing && styles.checkoutButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          {placing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Payment Method Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <Text style={styles.paymentModalTitle}>Select Payment Method</Text>
            
            {loadingWallet ? (
              <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 20 }} />
            ) : (
              <>
                {/* Wallet Payment Option */}
                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => handlePaymentMethodSelect('WALLET')}
                >
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name="wallet" size={28} color="#4CAF50" />
                  </View>
                  <View style={styles.paymentOptionContent}>
                    <Text style={styles.paymentOptionTitle}>Pay from Wallet</Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Balance: ₹{walletBalance.toFixed(2)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>

                {/* COD Payment Option */}
                <TouchableOpacity
                  style={[styles.paymentOption, { marginTop: 12 }]}
                  onPress={() => handlePaymentMethodSelect('COD')}
                >
                  <View style={styles.paymentOptionIcon}>
                    <Ionicons name="cash" size={28} color="#FF9800" />
                  </View>
                  <View style={styles.paymentOptionContent}>
                    <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
                    <Text style={styles.paymentOptionSubtitle}>
                      Pay when you receive
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </>
            )}

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.paymentCancelButton}
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={styles.paymentCancelText}>Cancel</Text>
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageEmoji: {
    fontSize: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemFarmer: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    minWidth: 35,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginLeft: 2,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeBtn: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  checkoutLabel: {
    fontSize: 12,
    color: '#666',
  },
  checkoutTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  checkoutButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '85%',
    maxWidth: 400,
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paymentOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  paymentOptionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  paymentCancelButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  paymentCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
