import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, FAB, Portal, Text } from 'react-native-paper';

import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useItems } from '@/hooks/useItems';
import { Item } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { fetchItem, deleteItem } = useItems();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleEdit = () => {
    // Navigate to edit screen (to be implemented)
    Alert.alert('Edit', 'Edit functionality to be implemented');
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!id) return;

    setDeleteLoading(true);
    try {
      const success = await deleteItem(id);

      if (success) {
        setDeleteDialogVisible(false);
        Alert.alert('Success', 'Item deleted successfully');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSell = () => {
    if (item) {
      router.push(`/sell/${id}`);
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text variant="headlineSmall" style={styles.name}>{item.name}</Text>

          <View style={styles.priceContainer}>
            <View style={styles.priceBox}>
              <Text variant="labelMedium">Buying Price</Text>
              <Text variant="titleMedium" style={styles.buyingPrice}>
                {formatCurrency(item.buyingPrice)}
              </Text>
            </View>

            <View style={styles.priceBox}>
              <Text variant="labelMedium">Selling Price</Text>
              <Text variant="titleMedium" style={styles.sellingPrice}>
                {formatCurrency(item.sellingPrice)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="inventory" size={20} color="#555" />
            <Text variant="bodyLarge" style={styles.infoText}>
              {item.units} units in stock
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color="#555" />
            <Text variant="bodyMedium" style={styles.infoText}>
              Added on {formatDate(item.createdAt)}
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text variant="labelLarge">Description</Text>
            <Text variant="bodyMedium" style={styles.description}>
              {item.description}
            </Text>
          </View>

          <Button
            mode="contained"
            icon="cart"
            onPress={handleSell}
            style={styles.sellButton}
            labelStyle={styles.sellButtonLabel}
          >
            Sell This Item
          </Button>
        </View>
      </ScrollView>

      {/* Edit FAB */}
      <FAB
        icon="pencil"
        style={[styles.fab, styles.editFab]}
        onPress={handleEdit}
        small
      />

      {/* Delete FAB */}
      <FAB
        icon="delete"
        style={[styles.fab, styles.deleteFab]}
        onPress={handleDelete}
        small
      />

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Item</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{item.name}"? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button onPress={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? <ActivityIndicator size={20} /> : 'Delete'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buyingPrice: {
    color: '#666',
  },
  sellingPrice: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#555',
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
  sellButton: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: '#0a7ea4',
  },
  sellButtonLabel: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
  editFab: {
    bottom: 80,
    backgroundColor: '#0a7ea4',
  },
  deleteFab: {
    bottom: 16,
    backgroundColor: '#d32f2f',
  },
  button: {
    marginTop: 16,
  },
});
