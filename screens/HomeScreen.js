import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useInventory } from '../hooks/useInventory';
import { useSales } from '../hooks/useSales';
import { formatDate } from '../utils/helpers';
import { addDummyInventoryItems, addDummySales } from '../utils/dummyData';

const HomeScreen = ({ navigation }) => {
  const { items, loading: loadingItems, error: itemsError, loadItems } = useInventory();
  const { recentSales, loading: loadingSales, error: salesError, loadRecentSales } = useSales();
  const [refreshing, setRefreshing] = useState(false);
  const [addingDummyData, setAddingDummyData] = useState(false);

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

  // Navigate to Add Item screen
  const handleAddItem = () => {
    navigation.navigate('AddItem');
  };

  // Navigate to Item Detail screen
  const handleItemPress = (itemId) => {
    navigation.navigate('ItemDetail', { itemId });
  };

  // Navigate to Stock screen
  const handleViewAllStock = () => {
    navigation.navigate('Stock');
  };

  // Navigate to Sales screen
  const handleViewAllSales = () => {
    navigation.navigate('Sales');
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.content}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stock Items</Text>
          <TouchableOpacity onPress={handleViewAllStock}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {!items || items.length === 0 ? (
          <Text style={styles.emptyText}>No items in stock. Add some items to get started.</Text>
        ) : (
          items.slice(0, 3).map(item => (
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

        <TouchableOpacity style={styles.dummyDataButton} onPress={handleAddDummyData}>
          <Text style={styles.dummyDataButtonText}>Add Dummy Data</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          <TouchableOpacity onPress={handleViewAllSales}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {!recentSales || recentSales.length === 0 ? (
          <Text style={styles.emptyText}>No sales recorded yet.</Text>
        ) : (
          recentSales.slice(0, 3).map(sale => (
            <View key={sale.id} style={styles.saleCard}>
              <Text style={styles.saleName}>{sale.itemName}</Text>
              <Text style={styles.salePrice}>KES {(sale.price * sale.quantity).toLocaleString()}</Text>
              <View style={styles.saleDetails}>
                <Text style={styles.saleInfo}>Qty: {sale.quantity}</Text>
                <Text style={styles.saleInfo}>{sale.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}</Text>
                <Text style={styles.saleInfo}>{formatDate(sale.saleDate)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

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
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
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

export default HomeScreen;
