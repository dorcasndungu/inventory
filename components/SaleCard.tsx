import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text } from 'react-native-paper';
import { Sale } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SaleCardProps {
  sale: Sale;
  onPress: (sale: Sale) => void;
}

export const SaleCard: React.FC<SaleCardProps> = ({ sale, onPress }) => {
  const handlePress = () => {
    onPress(sale);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: sale.itemImageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </View>
          <View style={styles.details}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.name}>
              {sale.itemName}
            </Text>
            <Text variant="bodyMedium" style={styles.price}>
              {formatCurrency(sale.sellingPrice * sale.quantity)}
            </Text>
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(sale.createdAt)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '500',
  },
  price: {
    marginTop: 4,
    color: '#0a7ea4',
  },
  date: {
    marginTop: 4,
    color: '#666',
  },
});
