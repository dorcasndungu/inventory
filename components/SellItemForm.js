import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useInventory } from '../hooks/useInventory';
import { useSales } from '../hooks/useSales';
import { validateSale, formatCurrency } from '../utils/helpers';

const SellItemForm = ({ itemId, onSuccess, onCancel }) => {
  const { loadItem, currentItem, loading: loadingItem, error: itemError } = useInventory();
  const { addSale } = useSales();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '1',
    description: '',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState({});

  // Load item details
  useEffect(() => {
    if (itemId) {
      loadItem(itemId);
    }
  }, [itemId]);

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!currentItem) return 0;
    const quantity = parseInt(formData.quantity) || 0;
    return quantity * (currentItem.price || 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!currentItem) {
        Alert.alert('Error', 'Item not found');
        return;
      }

      // Validate form data
      const saleData = {
        itemId: currentItem.id,
        itemName: currentItem.name,
        quantity: parseInt(formData.quantity) || 0,
        price: currentItem.price || 0,
        description: formData.description,
        paymentMethod: formData.paymentMethod
      };

      const validation = validateSale(saleData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Check if enough items in stock
      if (saleData.quantity > currentItem.units) {
        setErrors({
          quantity: `Only ${currentItem.units} units available in stock`
        });
        return;
      }

      setLoading(true);

      // Record the sale
      const saleId = await addSale(saleData);
      
      if (saleId) {
        Alert.alert('Success', 'Sale recorded successfully');
        if (onSuccess) {
          onSuccess(saleId);
        }
      } else {
        Alert.alert('Error', 'Failed to record sale');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record sale: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loadingItem || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>
          {loadingItem ? 'Loading item details...' : 'Recording sale...'}
        </Text>
      </View>
    );
  }

  // Show error state
  if (itemError || !currentItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {itemError || 'Item not found'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sell Item</Text>
      
      <View style={styles.itemCard}>
        <Text style={styles.itemName}>{currentItem.name}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(currentItem.price)} per unit</Text>
        <Text style={styles.itemUnits}>{currentItem.units} units in stock</Text>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={[styles.input, errors.quantity && styles.inputError]}
          value={formData.quantity}
          onChangeText={(value) => handleChange('quantity', value)}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />
        {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
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
              formData.paymentMethod === 'cash' && styles.selectedPaymentOption
            ]}
            onPress={() => handleChange('paymentMethod', 'cash')}
          >
            <Text style={[
              styles.paymentOptionText,
              formData.paymentMethod === 'cash' && styles.selectedPaymentOptionText
            ]}>Cash</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'mpesa' && styles.selectedPaymentOption
            ]}
            onPress={() => handleChange('paymentMethod', 'mpesa')}
          >
            <Text style={[
              styles.paymentOptionText,
              formData.paymentMethod === 'mpesa' && styles.selectedPaymentOptionText
            ]}>M-Pesa</Text>
          </TouchableOpacity>
        </View>
        {errors.paymentMethod && <Text style={styles.errorText}>{errors.paymentMethod}</Text>}
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalPrice}>{formatCurrency(calculateTotal())}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Complete Sale</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0a7ea4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginTop: 5,
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

export default SellItemForm;
