import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Sample data for demonstration
const SAMPLE_ITEMS = {
  '1': { id: '1', name: 'Laptop', price: 120000, units: 5 },
  '2': { id: '2', name: 'Smartphone', price: 45000, units: 10 },
  '3': { id: '3', name: 'Headphones', price: 5000, units: 20 },
};

export default function SellItemScreen() {
  const { id } = useLocalSearchParams();
  const item = SAMPLE_ITEMS[id];
  
  const [quantity, setQuantity] = useState('1');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
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
  
  const handleSubmit = () => {
    // Validate form
    if (!quantity || parseInt(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }
    
    if (parseInt(quantity) > item.units) {
      Alert.alert('Error', `Only ${item.units} units available in stock`);
      return;
    }
    
    // In a real app, this would save to Firebase
    Alert.alert('Success', 'Sale recorded successfully', [
      { text: 'OK', onPress: () => router.push('/sales') }
    ]);
  };
  
  const totalPrice = parseInt(quantity || '0') * item.price;
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sell Item</Text>
      
      <View style={styles.itemCard}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>KES {item.price.toLocaleString()} per unit</Text>
        <Text style={styles.itemUnits}>{item.units} units in stock</Text>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter sale description"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.selectedPaymentOption
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'cash' && styles.selectedPaymentOptionText
            ]}>Cash</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'mpesa' && styles.selectedPaymentOption
            ]}
            onPress={() => setPaymentMethod('mpesa')}
          >
            <Text style={[
              styles.paymentOptionText,
              paymentMethod === 'mpesa' && styles.selectedPaymentOptionText
            ]}>M-Pesa</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalPrice}>KES {totalPrice.toLocaleString()}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Complete Sale</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
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
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  paymentOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedPaymentOption: {
    borderColor: '#0a7ea4',
    backgroundColor: '#e6f7fc',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPaymentOptionText: {
    color: '#0a7ea4',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
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
