import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';

import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useItems } from '@/hooks/useItems';
import { useSales } from '@/hooks/useSales';
import { Item, PaymentMethod } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function SellItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchItem } = useItems();
  const { addSale } = useSales();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadItem = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const itemData = await fetchItem(id);
        setItem(itemData);
      } catch (error) {
        console.error('Error fetching item:', error);
        Alert.alert('Error', 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, fetchItem]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!quantity.trim()) newErrors.quantity = 'Quantity is required';
    else if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    } else if (item && Number(quantity) > item.units) {
      newErrors.quantity = `Only ${item.units} units available in stock`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !item) return;

    setSubmitting(true);

    try {
      const saleData = {
        description,
        quantity: Number(quantity),
        paymentMethod,
      };

      const saleId = await addSale(item, saleData);

      if (saleId) {
        Alert.alert('Success', 'Sale recorded successfully');
        router.push('/(tabs)/sales');
      } else {
        Alert.alert('Error', 'Failed to record sale');
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading item details..." />;
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Text variant="headlineSmall">Item not found</Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  const totalPrice = Number(quantity) * item.sellingPrice;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.itemPreview}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
          </View>

          <View style={styles.itemInfo}>
            <Text variant="titleMedium" numberOfLines={2}>{item.name}</Text>
            <Text variant="bodyMedium" style={styles.price}>
              {formatCurrency(item.sellingPrice)} per unit
            </Text>
            <Text variant="bodySmall" style={styles.stock}>
              {item.units} units in stock
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text variant="titleLarge" style={styles.formTitle}>Sale Details</Text>

          <TextInput
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.input}
            keyboardType="numeric"
            error={!!errors.quantity}
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}

          <Text variant="bodyLarge" style={styles.label}>Payment Method</Text>
          <RadioButton.Group onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} value={paymentMethod}>
            <View style={styles.radioContainer}>
              <View style={styles.radioButton}>
                <RadioButton value="cash" />
                <Text>Cash</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="mpesa" />
                <Text>M-Pesa</Text>
              </View>
            </View>
          </RadioButton.Group>

          <View style={styles.totalContainer}>
            <Text variant="titleMedium">Total Amount:</Text>
            <Text variant="headlineSmall" style={styles.totalPrice}>
              {formatCurrency(totalPrice)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.submitButton}
              icon="check"
            >
              Complete Sale
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={submitting}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  itemPreview: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  price: {
    marginTop: 4,
    color: '#0a7ea4',
  },
  stock: {
    marginTop: 4,
    color: '#666',
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  label: {
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  totalPrice: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 6,
    backgroundColor: '#0a7ea4',
  },
  button: {
    paddingVertical: 6,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginTop: -8,
    fontSize: 12,
  },
});
