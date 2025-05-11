import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { Item } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ItemCardProps {
  item: Item;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16px padding on each side and 16px gap

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const handlePress = () => {
    router.push(`/item/${item.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </View>
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          <Text variant="bodyMedium" style={styles.price}>
            {formatCurrency(item.sellingPrice)}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingVertical: 8,
  },
  name: {
    fontWeight: '500',
  },
  price: {
    marginTop: 4,
    color: '#0a7ea4',
  },
});
