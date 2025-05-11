import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSales } from '../hooks/useSales';
import { formatDate } from '../utils/helpers';

/**
 * Sales screen component
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Function to handle back button press
 * @returns {JSX.Element} - Sales screen component
 */
const SalesScreen = ({ onBack }) => {
  const { sales, loading, error, loadSales, calculateTotalSales } = useSales();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Loading sales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sales History</Text>
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Sales:</Text>
        <Text style={styles.totalAmount}>KES {calculateTotalSales().toLocaleString()}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
        
        {!sales || sales.length === 0 ? (
          <Text style={styles.emptyText}>No sales recorded yet.</Text>
        ) : (
          sales.map(sale => (
            <View key={sale.id} style={styles.saleCard}>
              <Text style={styles.saleName}>{sale.itemName}</Text>
              <Text style={styles.salePrice}>KES {(sale.price * sale.quantity).toLocaleString()}</Text>
              <View style={styles.saleDetails}>
                <Text style={styles.saleInfo}>Qty: {sale.quantity}</Text>
                <Text style={styles.saleInfo}>{sale.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}</Text>
                <Text style={styles.saleInfo}>{formatDate(sale.saleDate)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0a7ea4',
  },
  header: {
    backgroundColor: '#0a7ea4',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginVertical: 20,
  },
  saleCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saleName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  salePrice: {
    fontSize: 16,
    color: '#0a7ea4',
    marginTop: 5,
  },
  saleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saleInfo: {
    fontSize: 14,
    color: '#666',
  },
});

export default SalesScreen;
