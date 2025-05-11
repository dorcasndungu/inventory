import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { ItemCard } from '@/components/ItemCard';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useItems } from '@/hooks/useItems';
import { Item } from '@/types';

export default function StockScreen() {
  const { items, loading, error, fetchItems } = useItems();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [fetchItems]);

  const handleAddItem = () => {
    router.push('/add-item');
  };

  if (loading && !refreshing) {
    return <LoadingIndicator message="Loading inventory..." />;
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <EmptyState
          title="No items in stock"
          message="Add your first inventory item by tapping the + button below."
          icon={<MaterialIcons name="inventory" size={64} color="#0a7ea4" />}
        />
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => <ItemCard item={item} />}
          keyExtractor={(item: Item) => item.id || ''}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddItem}
      />
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a7ea4',
  },
});
