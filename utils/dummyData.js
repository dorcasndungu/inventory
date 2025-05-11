import { addInventoryItem } from './inventoryService';
import { recordSale } from './salesService';

// Dummy inventory items
const DUMMY_ITEMS = [
  {
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    units: 5,
    buyingPrice: 100000,
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80'
  },
  {
    name: 'Smartphone',
    description: 'Latest model with 128GB storage and 8GB RAM',
    units: 10,
    buyingPrice: 38000,
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1227&q=80'
  },
  {
    name: 'Headphones',
    description: 'Noise-cancelling wireless headphones',
    units: 20,
    buyingPrice: 3500,
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    name: 'Tablet',
    description: '10-inch tablet with 64GB storage',
    units: 8,
    buyingPrice: 25000,
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80'
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor',
    units: 15,
    buyingPrice: 8000,
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80'
  }
];

/**
 * Add dummy inventory items to Firebase
 * @returns {Promise<Array>} - Array of added item IDs
 */
export const addDummyInventoryItems = async () => {
  try {
    const itemIds = [];
    
    for (const item of DUMMY_ITEMS) {
      const id = await addInventoryItem(item);
      if (id) {
        itemIds.push({ id, ...item });
      }
    }
    
    console.log(`Added ${itemIds.length} dummy inventory items`);
    return itemIds;
  } catch (error) {
    console.error('Error adding dummy inventory items:', error);
    throw error;
  }
};

/**
 * Add dummy sales to Firebase
 * @param {Array} items - Array of inventory items
 * @returns {Promise<Array>} - Array of added sale IDs
 */
export const addDummySales = async (items) => {
  try {
    if (!items || items.length === 0) {
      console.error('No items provided for dummy sales');
      return [];
    }
    
    const saleIds = [];
    const paymentMethods = ['cash', 'mpesa'];
    
    // Create a few sales for each item
    for (const item of items) {
      const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity between 1 and 3
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      const sale = {
        itemId: item.id,
        itemName: item.name,
        quantity,
        price: item.price,
        description: `Sale of ${quantity} ${item.name}`,
        paymentMethod
      };
      
      const id = await recordSale(sale);
      if (id) {
        saleIds.push(id);
      }
    }
    
    console.log(`Added ${saleIds.length} dummy sales`);
    return saleIds;
  } catch (error) {
    console.error('Error adding dummy sales:', error);
    throw error;
  }
};
