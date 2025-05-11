import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useInventory } from './hooks/useInventory';
import { useSales } from './hooks/useSales';
import { addDummyInventoryItems, addDummySales } from './utils/dummyData';
import { formatDate } from './utils/helpers';

export default function App() {
  // Custom hooks
  const { items, loading: loadingItems, error: itemsError, loadItems, addItem, updateItem, deleteItem } = useInventory();
  const { recentSales, sales, loading: loadingSales, error: salesError, loadRecentSales, loadSales, addSale, calculateTotalSales } = useSales();

  // App state
  const [refreshing, setRefreshing] = useState(false);
  const [addingDummyData, setAddingDummyData] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Add Item Screen States
  const [addItemFormData, setAddItemFormData] = useState({
    name: '',
    description: '',
    units: '',
    buyingPrice: '',
    sellingPrice: '',
  });
  const [addItemErrors, setAddItemErrors] = useState({});
  const [isAddItemSubmitting, setIsAddItemSubmitting] = useState(false);

  // Sell Item Screen States
  const [sellQuantity, setSellQuantity] = useState('1');
  const [sellPaymentMethod, setSellPaymentMethod] = useState('cash');
  const [sellErrors, setSellErrors] = useState({});
  const [isSellSubmitting, setIsSellSubmitting] = useState(false);
  const [sellDescription, setSellDescription] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  // Item Detail Screen States
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    units: '',
    buyingPrice: '',
    sellingPrice: '',
  });
  const [editErrors, setEditErrors] = useState({});

  // Add dummy data to Firebase
  const handleAddDummyData = async () => {
    try {
      setAddingDummyData(true);
      Alert.alert('Adding Dummy Data', 'Adding dummy inventory items and sales...');

      // Add dummy inventory items
      const dummyItems = await addDummyInventoryItems();

      // Add dummy sales using the added items
      if (dummyItems.length > 0) {
        await addDummySales(dummyItems);
      }

      // Refresh the data
      await Promise.all([loadItems(), loadRecentSales()]);

      Alert.alert('Success', 'Dummy data added successfully');
    } catch (error) {
      console.error('Error adding dummy data:', error);
      Alert.alert('Error', `Failed to add dummy data: ${error.message}`);
    } finally {
      setAddingDummyData(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadItems(), loadRecentSales()]);
    setRefreshing(false);
  };

  // Show error if any
  useEffect(() => {
    if (itemsError) {
      Alert.alert('Error', `Failed to load inventory items: ${itemsError}`);
    }
    if (salesError) {
      Alert.alert('Error', `Failed to load sales: ${salesError}`);
    }
  }, [itemsError, salesError]);

  // Initialize edit form data when selectedItem changes
  useEffect(() => {
    if (activeScreen === 'itemDetail' && selectedItemId) {
      const selectedItem = items.find(item => item.id === selectedItemId);
      if (selectedItem) {
        setEditFormData({
          name: selectedItem.name || '',
          description: selectedItem.description || '',
          units: selectedItem.units?.toString() || '',
          buyingPrice: selectedItem.buyingPrice?.toString() || '',
          sellingPrice: selectedItem.price?.toString() || '',
        });
      }
    }
  }, [activeScreen, selectedItemId, items]);

  // Load sales when the Sales screen is shown
  useEffect(() => {
    if (activeScreen === 'sales') {
      const loadAllSales = async () => {
        await loadSales();
      };
      loadAllSales();
    }
  }, [activeScreen, loadSales]);

  // Set initial selling price for Sell Item screen
  useEffect(() => {
    if (activeScreen === 'sellItem' && selectedItemId) {
      const selectedItem = items.find(item => item.id === selectedItemId);
      if (selectedItem && (!sellPrice || sellPrice === '')) {
        setSellPrice(selectedItem.price?.toString() || '0');
      }
    }
  }, [activeScreen, selectedItemId, items, sellPrice]);

  // Handle add item button press
  const handleAddItem = () => {
    // Reset form data
    setAddItemFormData({
      name: '',
      description: '',
      units: '',
      buyingPrice: '',
      sellingPrice: '',
    });
    setAddItemErrors({});
    setIsAddItemSubmitting(false);
    setActiveScreen('addItem');
  };

  // Handle item press
  const handleItemPress = (itemId) => {
    setSelectedItemId(itemId);
    setIsDeleting(false);
    setIsEditing(false);
    setActiveScreen('itemDetail');
  };

  // Handle sell item
  const handleSellItem = (itemId) => {
    setSelectedItemId(itemId);
    setSellQuantity('1');
    setSellPaymentMethod('cash');
    setSellErrors({});
    setIsSellSubmitting(false);
    setActiveScreen('sellItem');
  };

  // Handle back button press
  const handleBack = () => {
    setActiveScreen('home');
    setSelectedItemId(null);
  };

  // Handle add item form input changes
  const handleAddItemChange = (field, value) => {
    setAddItemFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (addItemErrors[field]) {
      setAddItemErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate add item form data
  const validateAddItemForm = () => {
    const newErrors = {};

    if (!addItemFormData.name || addItemFormData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (!addItemFormData.units || isNaN(addItemFormData.units) || parseInt(addItemFormData.units) < 0) {
      newErrors.units = 'Units must be a non-negative number';
    }

    if (!addItemFormData.buyingPrice || isNaN(addItemFormData.buyingPrice) || parseFloat(addItemFormData.buyingPrice) <= 0) {
      newErrors.buyingPrice = 'Buying price must be a positive number';
    }

    if (!addItemFormData.sellingPrice || isNaN(addItemFormData.sellingPrice) || parseFloat(addItemFormData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Selling price must be a positive number';
    }

    setAddItemErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add item form submission
  const handleAddItemSubmit = async () => {
    if (!validateAddItemForm()) {
      return;
    }

    try {
      setIsAddItemSubmitting(true);

      // Prepare item data
      const itemData = {
        name: addItemFormData.name,
        description: addItemFormData.description,
        units: parseInt(addItemFormData.units),
        buyingPrice: parseFloat(addItemFormData.buyingPrice),
        price: parseFloat(addItemFormData.sellingPrice),
      };

      // Add item to database
      const itemId = await addItem(itemData);

      if (itemId) {
        Alert.alert('Success', 'Item added successfully');
        // Reset form and go back to home screen
        setAddItemFormData({
          name: '',
          description: '',
          units: '',
          buyingPrice: '',
          sellingPrice: '',
        });
        handleBack();
      } else {
        Alert.alert('Error', 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', `Failed to add item: ${error.message}`);
    } finally {
      setIsAddItemSubmitting(false);
    }
  };

  // Render loading state
  if (loadingItems || loadingSales || addingDummyData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>
          {addingDummyData ? 'Adding dummy data...' : 'Loading data...'}
        </Text>
      </View>
    );
  }

  // Render different screens based on activeScreen state
  // Add Item Screen
  if (activeScreen === 'addItem') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Item</Text>
        </View>

        {isAddItemSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.loadingText}>Adding item...</Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            <Text style={styles.formLabel}>Item Name</Text>
            <TextInput
              style={[styles.input, addItemErrors.name && styles.inputError]}
              placeholder="Enter item name"
              value={addItemFormData.name}
              onChangeText={(value) => handleAddItemChange('name', value)}
            />
            {addItemErrors.name && <Text style={styles.errorText}>{addItemErrors.name}</Text>}

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              multiline
              value={addItemFormData.description}
              onChangeText={(value) => handleAddItemChange('description', value)}
            />

            <Text style={styles.formLabel}>Units</Text>
            <TextInput
              style={[styles.input, addItemErrors.units && styles.inputError]}
              placeholder="Enter units"
              keyboardType="numeric"
              value={addItemFormData.units}
              onChangeText={(value) => handleAddItemChange('units', value)}
            />
            {addItemErrors.units && <Text style={styles.errorText}>{addItemErrors.units}</Text>}

            <Text style={styles.formLabel}>Buying Price (KES)</Text>
            <TextInput
              style={[styles.input, addItemErrors.buyingPrice && styles.inputError]}
              placeholder="Enter buying price"
              keyboardType="numeric"
              value={addItemFormData.buyingPrice}
              onChangeText={(value) => handleAddItemChange('buyingPrice', value)}
            />
            {addItemErrors.buyingPrice && <Text style={styles.errorText}>{addItemErrors.buyingPrice}</Text>}

            <Text style={styles.formLabel}>Selling Price (KES)</Text>
            <TextInput
              style={[styles.input, addItemErrors.sellingPrice && styles.inputError]}
              placeholder="Enter selling price"
              keyboardType="numeric"
              value={addItemFormData.sellingPrice}
              onChangeText={(value) => handleAddItemChange('sellingPrice', value)}
            />
            {addItemErrors.sellingPrice && <Text style={styles.errorText}>{addItemErrors.sellingPrice}</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={handleAddItemSubmit}>
              <Text style={styles.submitButtonText}>Add Item</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Bottom Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveScreen('home')}
          >
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, styles.activeTab]}
            onPress={handleAddItem}
          >
            <Text style={[styles.tabText, styles.activeTabText]}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveScreen('sales')}
          >
            <Text style={styles.tabText}>Sales</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Item Detail Screen
  if (activeScreen === 'itemDetail' && selectedItemId) {
    const selectedItem = items.find(item => item.id === selectedItemId);

    // Handle edit form input changes
    const handleEditChange = (field, value) => {
      setEditFormData(prev => ({ ...prev, [field]: value }));
      // Clear error for this field if it exists
      if (editErrors[field]) {
        setEditErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    // Validate edit form data
    const validateEditForm = () => {
      const newErrors = {};

      if (!editFormData.name || editFormData.name.trim() === '') {
        newErrors.name = 'Name is required';
      }

      if (!editFormData.units || isNaN(editFormData.units) || parseInt(editFormData.units) < 0) {
        newErrors.units = 'Units must be a non-negative number';
      }

      if (!editFormData.buyingPrice || isNaN(editFormData.buyingPrice) || parseFloat(editFormData.buyingPrice) <= 0) {
        newErrors.buyingPrice = 'Buying price must be a positive number';
      }

      if (!editFormData.sellingPrice || isNaN(editFormData.sellingPrice) || parseFloat(editFormData.sellingPrice) <= 0) {
        newErrors.sellingPrice = 'Selling price must be a positive number';
      }

      setEditErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Handle edit form submission
    const handleEditSubmit = async () => {
      if (!validateEditForm() || !selectedItem) {
        return;
      }

      try {
        setIsEditing(true);

        // Prepare item data
        const itemData = {
          name: editFormData.name,
          description: editFormData.description,
          units: parseInt(editFormData.units),
          buyingPrice: parseFloat(editFormData.buyingPrice),
          price: parseFloat(editFormData.sellingPrice),
        };

        // Update item in database
        const success = await updateItem(selectedItem.id, itemData);

        if (success) {
          Alert.alert('Success', 'Item updated successfully');
          // Exit edit mode
          setIsEditing(false);
        } else {
          Alert.alert('Error', 'Failed to update item');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        Alert.alert('Error', `Failed to update item: ${error.message}`);
      } finally {
        setIsEditing(false);
      }
    };

    // Handle delete button press
    const handleDeletePress = () => {
      Alert.alert(
        'Delete Item',
        `Are you sure you want to delete ${selectedItem?.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDeleteConfirm
          },
        ]
      );
    };

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
      if (!selectedItem) return;

      try {
        setIsDeleting(true);

        // Delete item from database
        const success = await deleteItem(selectedItem.id);

        if (success) {
          Alert.alert('Success', 'Item deleted successfully');
          // Go back to home screen
          handleBack();
        } else {
          Alert.alert('Error', 'Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        Alert.alert('Error', `Failed to delete item: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    };

    // Handle edit button press
    const handleEditPress = () => {
      setIsEditing(true);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
      // Reset form data to original values
      if (selectedItem) {
        setEditFormData({
          name: selectedItem.name || '',
          description: selectedItem.description || '',
          units: selectedItem.units?.toString() || '',
          buyingPrice: selectedItem.buyingPrice?.toString() || '',
          sellingPrice: selectedItem.price?.toString() || '',
        });
      }
      setEditErrors({});
      setIsEditing(false);
    };

    if (!selectedItem) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Item Details</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.errorText}>Item not found</Text>
          </View>
        </View>
      );
    }

    // Show loading state while deleting
    if (isDeleting) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Item Details</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.loadingText}>Deleting item...</Text>
          </View>
        </View>
      );
    }

    // Show edit form
    if (isEditing) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Item</Text>
          </View>
          <ScrollView style={styles.content}>
            <Text style={styles.formLabel}>Item Name</Text>
            <TextInput
              style={[styles.input, editErrors.name && styles.inputError]}
              placeholder="Enter item name"
              value={editFormData.name}
              onChangeText={(value) => handleEditChange('name', value)}
            />
            {editErrors.name && <Text style={styles.errorText}>{editErrors.name}</Text>}

            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              multiline
              value={editFormData.description}
              onChangeText={(value) => handleEditChange('description', value)}
            />

            <Text style={styles.formLabel}>Units</Text>
            <TextInput
              style={[styles.input, editErrors.units && styles.inputError]}
              placeholder="Enter units"
              keyboardType="numeric"
              value={editFormData.units}
              onChangeText={(value) => handleEditChange('units', value)}
            />
            {editErrors.units && <Text style={styles.errorText}>{editErrors.units}</Text>}

            <Text style={styles.formLabel}>Buying Price (KES)</Text>
            <TextInput
              style={[styles.input, editErrors.buyingPrice && styles.inputError]}
              placeholder="Enter buying price"
              keyboardType="numeric"
              value={editFormData.buyingPrice}
              onChangeText={(value) => handleEditChange('buyingPrice', value)}
            />
            {editErrors.buyingPrice && <Text style={styles.errorText}>{editErrors.buyingPrice}</Text>}

            <Text style={styles.formLabel}>Selling Price (KES)</Text>
            <TextInput
              style={[styles.input, editErrors.sellingPrice && styles.inputError]}
              placeholder="Enter selling price"
              keyboardType="numeric"
              value={editFormData.sellingPrice}
              onChangeText={(value) => handleEditChange('sellingPrice', value)}
            />
            {editErrors.sellingPrice && <Text style={styles.errorText}>{editErrors.sellingPrice}</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={handleEditSubmit}>
              <Text style={styles.submitButtonText}>Update Item</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    // Show item details
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.detailTitle}>{selectedItem.name}</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Buying Price:</Text>
              <Text style={styles.detailValue}>KES {selectedItem.buyingPrice?.toLocaleString() || '0'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Selling Price:</Text>
              <Text style={styles.detailValue}>KES {selectedItem.price?.toLocaleString() || '0'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Units in Stock:</Text>
              <Text style={styles.detailValue}>{selectedItem.units || 0}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
            </View>
            <Text style={styles.detailDescription}>{selectedItem.description || 'No description'}</Text>
          </View>

          <TouchableOpacity
            style={styles.sellButton}
            onPress={() => handleSellItem(selectedItemId)}
            disabled={!selectedItem.units || selectedItem.units <= 0}
          >
            <Text style={styles.sellButtonText}>
              {selectedItem.units && selectedItem.units > 0 ? 'Sell This Item' : 'Out of Stock'}
            </Text>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }



  // Sell Item Screen
  if (activeScreen === 'sellItem' && selectedItemId) {
    const selectedItem = items.find(item => item.id === selectedItemId);

    // Calculate total price
    const totalPrice = (parseInt(sellQuantity) || 0) * (parseFloat(sellPrice) || selectedItem?.price || 0);

    // Handle quantity change
    const handleQuantityChange = (value) => {
      setSellQuantity(value);
      // Clear error if it exists
      if (sellErrors.quantity) {
        setSellErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.quantity;
          return newErrors;
        });
      }
    };

    // Handle price change
    const handlePriceChange = (value) => {
      setSellPrice(value);
      // Clear error if it exists
      if (sellErrors.price) {
        setSellErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.price;
          return newErrors;
        });
      }
    };

    // Handle description change
    const handleDescriptionChange = (value) => {
      setSellDescription(value);
    };

    // Handle payment method change
    const handlePaymentMethodChange = (method) => {
      setSellPaymentMethod(method);
    };

    // Validate form data
    const validateSellForm = () => {
      const newErrors = {};

      if (!sellQuantity || isNaN(sellQuantity) || parseInt(sellQuantity) <= 0) {
        newErrors.quantity = 'Quantity must be a positive number';
      } else if (selectedItem && parseInt(sellQuantity) > selectedItem.units) {
        newErrors.quantity = `Only ${selectedItem.units} units available in stock`;
      }

      if (!sellPrice || isNaN(sellPrice) || parseFloat(sellPrice) <= 0) {
        newErrors.price = 'Price must be a positive number';
      }

      setSellErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSellSubmit = async () => {
      if (!validateSellForm() || !selectedItem) {
        return;
      }

      try {
        setIsSellSubmitting(true);

        // Prepare sale data
        const saleData = {
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          quantity: parseInt(sellQuantity),
          price: parseFloat(sellPrice) || selectedItem.price,
          paymentMethod: sellPaymentMethod,
          description: sellDescription || `Sale of ${sellQuantity} ${selectedItem.name}`
        };

        // Record the sale
        const saleId = await addSale(saleData);

        if (saleId) {
          Alert.alert('Success', 'Sale recorded successfully');
          // Reset form and go back to home screen
          setSellQuantity('1');
          setSellPaymentMethod('cash');
          setSellPrice('');
          setSellDescription('');
          handleBack();
        } else {
          Alert.alert('Error', 'Failed to record sale');
        }
      } catch (error) {
        console.error('Error recording sale:', error);
        Alert.alert('Error', `Failed to record sale: ${error.message}`);
      } finally {
        setIsSellSubmitting(false);
      }
    };

    if (!selectedItem) {
      return (
        <View style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sell Item</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.errorText}>Item not found</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sell Item</Text>
        </View>

        {isSellSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.loadingText}>Recording sale...</Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{selectedItem.name}</Text>
              <Text style={styles.itemPrice}>Default Price: KES {selectedItem.price?.toLocaleString() || '0'} per unit</Text>
              <Text style={styles.itemUnits}>{selectedItem.units || 0} units in stock</Text>
            </View>

            <Text style={styles.formLabel}>Quantity</Text>
            <TextInput
              style={[styles.input, sellErrors.quantity && styles.inputError]}
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={sellQuantity}
              onChangeText={handleQuantityChange}
            />
            {sellErrors.quantity && <Text style={styles.errorText}>{sellErrors.quantity}</Text>}

            <Text style={styles.formLabel}>Selling Price (KES)</Text>
            <TextInput
              style={[styles.input, sellErrors.price && styles.inputError]}
              placeholder="Enter selling price"
              keyboardType="numeric"
              value={sellPrice}
              onChangeText={handlePriceChange}
            />
            {sellErrors.price && <Text style={styles.errorText}>{sellErrors.price}</Text>}

            <Text style={styles.formLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter sale description"
              multiline
              value={sellDescription}
              onChangeText={handleDescriptionChange}
            />

            <Text style={styles.formLabel}>Payment Method</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  sellPaymentMethod === 'cash' && styles.selectedPaymentOption
                ]}
                onPress={() => handlePaymentMethodChange('cash')}
              >
                <Text style={[
                  styles.paymentOptionText,
                  sellPaymentMethod === 'cash' && styles.selectedPaymentOptionText
                ]}>Cash</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  sellPaymentMethod === 'mpesa' && styles.selectedPaymentOption
                ]}
                onPress={() => handlePaymentMethodChange('mpesa')}
              >
                <Text style={[
                  styles.paymentOptionText,
                  sellPaymentMethod === 'mpesa' && styles.selectedPaymentOptionText
                ]}>M-Pesa</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalPrice}>KES {totalPrice.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSellSubmit}
              disabled={selectedItem.units <= 0}
            >
              <Text style={styles.submitButtonText}>
                {selectedItem.units > 0 ? 'Complete Sale' : 'Out of Stock'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    );
  }

  // Sales Screen
  if (activeScreen === 'sales') {

    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sales History</Text>
        </View>

        {loadingSales ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <Text style={styles.loadingText}>Loading sales...</Text>
          </View>
        ) : (
          <>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Sales:</Text>
              <Text style={styles.totalAmount}>KES {calculateTotalSales().toLocaleString()}</Text>
            </View>

            <ScrollView style={styles.content}>
              {salesError && (
                <Text style={styles.errorText}>Error: {salesError}</Text>
              )}

              {!sales || sales.length === 0 ? (
                <Text style={styles.emptyText}>No sales recorded yet.</Text>
              ) : (
                sales.map(sale => (
                  <View key={sale.id} style={styles.saleCard}>
                    <Text style={styles.saleName}>{sale.itemName}</Text>
                    <Text style={styles.salePrice}>KES {(sale.price * sale.quantity).toLocaleString()}</Text>
                    {sale.description && (
                      <Text style={styles.saleDescription}>{sale.description}</Text>
                    )}
                    <View style={styles.saleDetails}>
                      <Text style={styles.saleInfo}>Qty: {sale.quantity}</Text>
                      <Text style={styles.saleInfo}>{sale.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}</Text>
                      <Text style={styles.saleInfo}>{formatDate(sale.saleDate)}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </>
        )}

        {/* Bottom Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveScreen('home')}
          >
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={handleAddItem}
          >
            <Text style={styles.tabText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, styles.activeTab]}
            onPress={() => setActiveScreen('sales')}
          >
            <Text style={[styles.tabText, styles.activeTabText]}>Sales</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Home Screen
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        <Text style={styles.sectionTitle}>Stock Items</Text>

        {!items || items.length === 0 ? (
          <Text style={styles.emptyText}>No items in stock. Add some items to get started.</Text>
        ) : (
          items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => handleItemPress(item.id)}
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>KES {item.price?.toLocaleString() || '0'}</Text>
              <Text style={styles.itemUnits}>{item.units || 0} units in stock</Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+ Add New Item</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, styles.activeTab]}
          onPress={() => setActiveScreen('home')}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={handleAddItem}
        >
          <Text style={styles.tabText}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveScreen('sales')}
        >
          <Text style={styles.tabText}>Sales</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  navButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
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
  dummyDataButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  dummyDataButtonText: {
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
  saleDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
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
  // Form styles
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 15,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Detail screen styles
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailCard: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  sellButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
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
    marginBottom: 30,
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
  // Payment options
  paymentOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
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
  // Tab Navigation Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
    paddingBottom: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#0a7ea4',
    backgroundColor: '#f0f9ff',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
});
