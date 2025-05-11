import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Sample data for demonstration
const SAMPLE_ITEMS = {
  '1': { id: '1', name: 'Laptop', description: 'High-performance laptop with 16GB RAM and 512GB SSD', price: 120000, buyingPrice: 100000, units: 5, date: '2023-06-10' },
  '2': { id: '2', name: 'Smartphone', description: 'Latest model with 128GB storage and 8GB RAM', price: 45000, buyingPrice: 38000, units: 10, date: '2023-06-09' },
  '3': { id: '3', name: 'Headphones', description: 'Noise-cancelling wireless headphones', price: 5000, buyingPrice: 3500, units: 20, date: '2023-06-08' },
};

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const item = SAMPLE_ITEMS[id];

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Item not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSell = () => {
    router.push(`/sell/${id}`);
  };

  const handleEdit = () => {
    Alert.alert('Edit', 'Edit functionality to be implemented');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Item deleted successfully', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.name}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.priceContainer}>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Buying Price</Text>
            <Text style={styles.buyingPrice}>KES {item.buyingPrice.toLocaleString()}</Text>
          </View>
          
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Selling Price</Text>
            <Text style={styles.sellingPrice}>KES {item.price.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Units in Stock:</Text>
          <Text style={styles.infoValue}>{item.units}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Added on:</Text>
          <Text style={styles.infoValue}>{item.date}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description:</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.sellButton} onPress={handleSell}>
          <Text style={styles.sellButtonText}>Sell This Item</Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priceBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  buyingPrice: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  sellingPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0a7ea4',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  sellButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sellButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
