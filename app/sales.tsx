import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Sample data for demonstration
const SAMPLE_SALES = [
  { id: '1', itemName: 'Laptop', price: 120000, quantity: 1, date: '2023-06-15', paymentMethod: 'mpesa' },
  { id: '2', itemName: 'Smartphone', price: 45000, quantity: 2, date: '2023-06-14', paymentMethod: 'cash' },
  { id: '3', itemName: 'Headphones', price: 5000, quantity: 3, date: '2023-06-13', paymentMethod: 'mpesa' },
];

export default function SalesScreen() {
  const renderItem = ({ item }: { item: typeof SAMPLE_SALES[0] }) => (
    <TouchableOpacity style={styles.saleCard}>
      <Text style={styles.saleName}>{item.itemName}</Text>
      <Text style={styles.salePrice}>KES {(item.price * item.quantity).toLocaleString()}</Text>
      <View style={styles.saleDetails}>
        <Text style={styles.saleQuantity}>Qty: {item.quantity}</Text>
        <Text style={styles.saleDate}>{item.date}</Text>
        <Text style={styles.salePayment}>
          {item.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales History</Text>
      <FlatList
        data={SAMPLE_SALES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
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
  saleQuantity: {
    fontSize: 14,
    color: '#666',
  },
  saleDate: {
    fontSize: 14,
    color: '#666',
  },
  salePayment: {
    fontSize: 14,
    color: '#666',
  },
});
