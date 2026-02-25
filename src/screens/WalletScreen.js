import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import walletService from '../services/walletService';

export default function WalletScreen() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadWalletData();
  }, [filter]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      
      const [balanceData, transactionsData] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(50, 0, filter === 'ALL' ? null : filter)
      ]);

      if (balanceData.success) {
        setWallet(balanceData.data);
      }

      if (transactionsData.success) {
        setTransactions(transactionsData.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const result = await walletService.addMoney(parseFloat(amount));
      
      if (result.success) {
        Alert.alert('Success', `₹${amount} added to your wallet successfully!`);
        setShowAddMoney(false);
        setAmount('');
        loadWalletData();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add money');
    } finally {
      setProcessing(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const getTransactionSummary = () => {
    const summary = transactions.reduce((acc, txn) => {
      if (txn.type === 'CREDIT') {
        acc.totalCredit += parseFloat(txn.amount);
      } else {
        acc.totalDebit += parseFloat(txn.amount);
      }
      return acc;
    }, { totalCredit: 0, totalDebit: 0 });
    
    return summary;
  };

  const getTransactionIcon = (type, transactionType) => {
    if (type === 'CREDIT') {
      return transactionType === 'ORDER_PAYMENT' 
        ? 'arrow-down-circle' 
        : 'add-circle';
    }
    return 'arrow-up-circle';
  };

  const getTransactionColor = (type) => {
    return type === 'CREDIT' ? '#4caf50' : '#f44336';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    }
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderTransaction = ({ item }) => {
    const userName = item.related_user?.full_name;
    const userRole = item.related_user?.role;
    const transactionColor = getTransactionColor(item.type);
    
    return (
      <View style={[styles.transactionCard, { borderLeftColor: transactionColor }]}>
        <View style={styles.transactionLeft}>
          <Ionicons 
            name={getTransactionIcon(item.type, item.transaction_type)} 
            size={32} 
            color={transactionColor} 
          />
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDesc}>{item.description}</Text>
            {userName && (
              <Text style={styles.transactionUser}>
                {item.type === 'CREDIT' ? 'From: ' : 'To: '}
                {userName} {userRole && `(${userRole.toLowerCase()})`}
              </Text>
            )}
            <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: transactionColor }
        ]}>
          {item.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />
        }
      >
        {/* Wallet Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet" size={32} color="#fff" />
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            ₹{wallet ? parseFloat(wallet.balance).toFixed(2) : '0.00'}
          </Text>
          
          {user?.role === 'CUSTOMER' && (
            <TouchableOpacity 
              style={styles.addMoneyButton}
              onPress={() => setShowAddMoney(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color="#2e7d32" />
              <Text style={styles.addMoneyText}>Add Money</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {['ALL', 'CREDIT', 'DEBIT'].map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterTab,
                filter === filterType && styles.filterTabActive
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterText,
                filter === filterType && styles.filterTextActive
              ]}>
                {filterType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction Summary */}
        {transactions.length > 0 && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#e8f5e9' }]}>
                <Ionicons name="arrow-down" size={20} color="#4caf50" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Total Received</Text>
                <Text style={[styles.summaryAmount, { color: '#4caf50' }]}>
                  ₹{getTransactionSummary().totalCredit.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#ffebee' }]}>
                <Ionicons name="arrow-up" size={20} color="#f44336" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Total Spent</Text>
                <Text style={[styles.summaryAmount, { color: '#f44336' }]}>
                  ₹{getTransactionSummary().totalDebit.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="receipt" size={20} color="#2e7d32" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Transaction History</Text>
            </View>
            {transactions.length > 0 && (
              <View style={styles.transactionBadge}>
                <Text style={styles.transactionBadgeText}>{transactions.length}</Text>
              </View>
            )}
          </View>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                {filter !== 'ALL' 
                  ? `No ${filter.toLowerCase()} transactions found`
                  : 'Your transaction history will appear here'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Add Money Modal */}
      <Modal
        visible={showAddMoney}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddMoney(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Money to Wallet</Text>
              <TouchableOpacity onPress={() => setShowAddMoney(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Enter Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="₹ 0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Quick Amount Buttons */}
            <Text style={styles.quickAmountLabel}>Quick Add</Text>
            <View style={styles.quickAmountContainer}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={styles.quickAmountText}>₹{quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.noteText}>
              💡 For now, this is a test feature. Money will be added instantly to your wallet.
            </Text>

            <TouchableOpacity
              style={[styles.confirmButton, processing && styles.confirmButtonDisabled]}
              onPress={handleAddMoney}
              disabled={processing}
            >
              {processing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Add Money</Text>
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
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#2e7d32',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addMoneyText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: '#2e7d32',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionBadge: {
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  transactionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#e0e0e0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionUser: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 16,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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
  confirmButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
