import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useInventory } from '../hooks/useInventory';
import { formatCurrency, formatDate, calculateProfitMargin } from '../utils/helpers';

const ItemDetails = ({ itemId, onSell, onEdit, onDelete, onBack }) => {
  const { loadItem, currentItem, loading, error, deleteItem } = useInventory();
  const [deleting, setDeleting] = useState(false);

  // Load item details
  useEffect(() => {
    if (itemId) {
      loadItem(itemId);
    }
  }, [itemId]);

  // Handle sell button press
  const handleSell = () => {
    if (onSell) {
      onSell(itemId);
    }
  };

  // Handle edit button press
  const handleEdit = () => {
    if (onEdit) {
      onEdit(itemId);
    }
  };

  // Handle delete button press
  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${currentItem?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const success = await deleteItem(itemId);
              if (success) {
                Alert.alert('Success', 'Item deleted successfully');
                if (onBack) {
                  onBack();
                }
              } else {
                Alert.alert('Error', 'Failed to delete item');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item: ' + error.message);
            } finally {
              setDeleting(false);
            }
          }
        },
      ]
    );
  };

  // Show loading state
  if (loading || deleting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>
          {deleting ? 'Deleting item...' : 'Loading item details...'}
        </Text>
      </View>
    );
  }

  // Show error state
  if (error || !currentItem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Item not found'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentItem.name}</Text>
      </View>

      {currentItem.imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: currentItem.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={styles.detailsContainer}>
        <View style={styles.priceContainer}>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Buying Price</Text>
            <Text style={styles.buyingPrice}>{formatCurrency(currentItem.buyingPrice)}</Text>
          </View>
          
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Selling Price</Text>
            <Text style={styles.sellingPrice}>{formatCurrency(currentItem.price)}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Profit Margin:</Text>
          <Text style={styles.infoValue}>
            {calculateProfitMargin(currentItem.buyingPrice, currentItem.price)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Units in Stock:</Text>
          <Text style={styles.infoValue}>{currentItem.units || 0}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Added on:</Text>
          <Text style={styles.infoValue}>{formatDate(currentItem.createdAt)}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description:</Text>
          <Text style={styles.descriptionText}>
            {currentItem.description || 'No description provided'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.sellButton} 
          onPress={handleSell}
          disabled={!currentItem.units || currentItem.units <= 0}
        >
          <Text style={styles.sellButtonText}>
            {currentItem.units && currentItem.units > 0 
              ? 'Sell This Item' 
              : 'Out of Stock'}
          </Text>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
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

export default ItemDetails;
