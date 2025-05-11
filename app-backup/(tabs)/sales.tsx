import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { FlatList, Modal, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { SaleCard } from '@/components/SaleCard';
import { useSales } from '@/hooks/useSales';
import { Sale } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function SalesScreen() {
  const { sales, loading, error, fetchSales } = useSales();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchSales();
    setRefreshing(false);
  }, [fetchSales]);

  const handleSalePress = (sale: Sale) => {
    setSelectedSale(sale);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSale(null);
  };

  if (loading && !refreshing) {
    return <LoadingIndicator message="Loading sales history..." />;
  }

  return (
    <View style={styles.container}>
      {sales.length === 0 ? (
        <EmptyState
          title="No sales yet"
          message="Sales will appear here after you sell items from your inventory."
          icon={<MaterialIcons name="point-of-sale" size={64} color="#0a7ea4" />}
        />
      ) : (
        <FlatList
          data={sales}
          renderItem={({ item }) => <SaleCard sale={item} onPress={handleSalePress} />}
          keyExtractor={(item: Sale) => item.id || ''}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Sale Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSale && (
              <>
                <View style={styles.modalHeader}>
                  <Text variant="headlineSmall">Sale Details</Text>
                  <Button onPress={closeModal} icon="close" mode="text" />
                </View>

                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedSale.itemImageUrl }}
                    style={styles.image}
                    contentFit="cover"
                  />
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyLarge" style={styles.label}>Item:</Text>
                  <Text variant="bodyLarge" style={styles.value}>{selectedSale.itemName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyLarge" style={styles.label}>Quantity:</Text>
                  <Text variant="bodyLarge" style={styles.value}>{selectedSale.quantity}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyLarge" style={styles.label}>Price:</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {formatCurrency(selectedSale.sellingPrice)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyLarge" style={styles.label}>Total:</Text>
                  <Text variant="bodyLarge" style={[styles.value, styles.total]}>
                    {formatCurrency(selectedSale.sellingPrice * selectedSale.quantity)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyLarge" style={styles.label}>Payment:</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {selectedSale.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyLarge" style={styles.label}>Date:</Text>
                  <Text variant="bodyLarge" style={styles.value}>
                    {formatDate(selectedSale.createdAt)}
                  </Text>
                </View>

                {selectedSale.description && (
                  <View style={styles.description}>
                    <Text variant="bodyLarge" style={styles.label}>Description:</Text>
                    <Text variant="bodyMedium">{selectedSale.description}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  value: {
    textAlign: 'right',
  },
  total: {
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  description: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
});
