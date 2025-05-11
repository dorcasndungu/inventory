import React, { useState } from 'react';
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
import { validateInventoryItem } from '../utils/helpers';
import { pickImage, uploadImage } from '../utils/imageService';

const AddItemForm = ({ onSuccess, onCancel }) => {
  const { addItem } = useInventory();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    units: '',
    buyingPrice: '',
    sellingPrice: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});

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

  // Handle image selection
  const handleSelectImage = async () => {
    try {
      const result = await pickImage();
      if (result) {
        setImageUri(result.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image: ' + error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data
      const itemData = {
        name: formData.name,
        description: formData.description,
        units: parseInt(formData.units) || 0,
        buyingPrice: parseFloat(formData.buyingPrice) || 0,
        price: parseFloat(formData.sellingPrice) || 0,
      };

      const validation = validateInventoryItem(itemData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setLoading(true);

      // Upload image if selected
      if (imageUri) {
        const imageUrl = await uploadImage(imageUri);
        itemData.imageUrl = imageUrl;
      }

      // Add item to database
      const itemId = await addItem(itemData);
      
      if (itemId) {
        Alert.alert('Success', 'Item added successfully');
        if (onSuccess) {
          onSuccess(itemId);
        }
      } else {
        Alert.alert('Error', 'Failed to add item');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Adding item...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Enter item name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Enter item description"
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Units</Text>
        <TextInput
          style={[styles.input, errors.units && styles.inputError]}
          value={formData.units}
          onChangeText={(value) => handleChange('units', value)}
          placeholder="Enter number of units"
          keyboardType="numeric"
        />
        {errors.units && <Text style={styles.errorText}>{errors.units}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Buying Price (KES)</Text>
        <TextInput
          style={[styles.input, errors.buyingPrice && styles.inputError]}
          value={formData.buyingPrice}
          onChangeText={(value) => handleChange('buyingPrice', value)}
          placeholder="Enter buying price"
          keyboardType="numeric"
        />
        {errors.buyingPrice && <Text style={styles.errorText}>{errors.buyingPrice}</Text>}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Selling Price (KES)</Text>
        <TextInput
          style={[styles.input, errors.sellingPrice && styles.inputError]}
          value={formData.sellingPrice}
          onChangeText={(value) => handleChange('sellingPrice', value)}
          placeholder="Enter selling price"
          keyboardType="numeric"
        />
        {errors.sellingPrice && <Text style={styles.errorText}>{errors.sellingPrice}</Text>}
      </View>
      
      <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
        <Text style={styles.imageButtonText}>
          {imageUri ? 'Change Image' : 'Select Image'}
        </Text>
      </TouchableOpacity>
      
      {imageUri && (
        <Text style={styles.imageSelectedText}>Image selected</Text>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Item</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '500',
  },
  imageSelectedText: {
    color: '#4caf50',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
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
});

export default AddItemForm;
