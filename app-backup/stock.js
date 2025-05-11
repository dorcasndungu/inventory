import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

// Sample data for demonstration
const SAMPLE_ITEMS = [
  { id: '1', name: 'Laptop', price: 120000, units: 5 },
  { id: '2', name: 'Smartphone', price: 45000, units: 10 },
  { id: '3', name: 'Headphones', price: 5000, units: 20 },
];

export default function StockScreen() {
  const renderItem = ({ item }) => (
    <Link href={`/item/${item.id}`} asChild>
      <TouchableOpacity style={styles.itemCard}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>KES {item.price.toLocaleString()}</Text>
        <Text style={styles.itemUnits}>{item.units} units in stock</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Items</Text>
      <FlatList
        data={SAMPLE_ITEMS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      <Link href="/add-item" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </Link>
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
    paddingBottom: 80,
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
