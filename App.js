import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Sample data for demonstration
const SAMPLE_ITEMS = [
  { id: '1', name: 'Laptop', price: 120000, units: 5 },
  { id: '2', name: 'Smartphone', price: 45000, units: 10 },
  { id: '3', name: 'Headphones', price: 5000, units: 20 },
];

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Stock Items</Text>
        
        {SAMPLE_ITEMS.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>KES {item.price.toLocaleString()}</Text>
            <Text style={styles.itemUnits}>{item.units} units in stock</Text>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Item</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Recent Sales</Text>
        
        <View style={styles.saleCard}>
          <Text style={styles.saleName}>Laptop</Text>
          <Text style={styles.salePrice}>KES 120,000</Text>
          <View style={styles.saleDetails}>
            <Text style={styles.saleInfo}>Qty: 1</Text>
            <Text style={styles.saleInfo}>M-Pesa</Text>
            <Text style={styles.saleInfo}>2023-06-15</Text>
          </View>
        </View>
        
        <View style={styles.saleCard}>
          <Text style={styles.saleName}>Smartphone</Text>
          <Text style={styles.salePrice}>KES 90,000</Text>
          <View style={styles.saleDetails}>
            <Text style={styles.saleInfo}>Qty: 2</Text>
            <Text style={styles.saleInfo}>Cash</Text>
            <Text style={styles.saleInfo}>2023-06-14</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
  },
  itemCard: {
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
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#0a7ea4',
    marginTop: 5,
  },
  itemUnits: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
