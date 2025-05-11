import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { ImagePickerComponent } from '@/components/ImagePickerComponent';
import { useItems } from '@/hooks/useItems';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [units, setUnits] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addItem } = useItems();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!units.trim()) newErrors.units = 'Units are required';
    else if (isNaN(Number(units)) || Number(units) <= 0) newErrors.units = 'Units must be a positive number';

    if (!buyingPrice.trim()) newErrors.buyingPrice = 'Buying price is required';
    else if (isNaN(Number(buyingPrice)) || Number(buyingPrice) <= 0) newErrors.buyingPrice = 'Buying price must be a positive number';

    if (!sellingPrice.trim()) newErrors.sellingPrice = 'Selling price is required';
    else if (isNaN(Number(sellingPrice)) || Number(sellingPrice) <= 0) newErrors.sellingPrice = 'Selling price must be a positive number';

    if (!imageUri) newErrors.image = 'Please select an image';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const item = {
        name,
        description,
        units: Number(units),
        buyingPrice: Number(buyingPrice),
        sellingPrice: Number(sellingPrice),
      };

      const itemId = await addItem(item, imageUri);

      if (itemId) {
        Alert.alert('Success', 'Item added successfully');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={styles.title}>Add New Item</Text>

        <ImagePickerComponent
          onImageSelected={setImageUri}
        />
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          error={!!errors.name}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
          numberOfLines={3}
          error={!!errors.description}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <TextInput
          label="Units"
          value={units}
          onChangeText={setUnits}
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.units}
        />
        {errors.units && <Text style={styles.errorText}>{errors.units}</Text>}

        <TextInput
          label="Buying Price (KES)"
          value={buyingPrice}
          onChangeText={setBuyingPrice}
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.buyingPrice}
        />
        {errors.buyingPrice && <Text style={styles.errorText}>{errors.buyingPrice}</Text>}

        <TextInput
          label="Selling Price (KES)"
          value={sellingPrice}
          onChangeText={setSellingPrice}
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.sellingPrice}
        />
        {errors.sellingPrice && <Text style={styles.errorText}>{errors.sellingPrice}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Add Item
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={loading}
            style={styles.button}
          >
            Cancel
          </Button>
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
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginTop: -4,
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 6,
  },
});
