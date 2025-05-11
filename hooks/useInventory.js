import { useState, useEffect } from 'react';
import { 
  getInventoryItems, 
  getInventoryItem, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../utils/inventoryService';

/**
 * Custom hook to manage inventory items
 * @returns {Object} - Inventory state and functions
 */
export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  // Load all inventory items
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInventoryItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load a single inventory item by ID
  const loadItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInventoryItem(id);
      setCurrentItem(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error loading inventory item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new inventory item
  const addItem = async (item) => {
    try {
      setLoading(true);
      setError(null);
      const id = await addInventoryItem(item);
      const newItem = { ...item, id };
      setItems(prevItems => [newItem, ...prevItems]);
      return id;
    } catch (err) {
      setError(err.message);
      console.error('Error adding inventory item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing inventory item
  const updateItem = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      await updateInventoryItem(id, data);
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...data } : item
        )
      );
      if (currentItem && currentItem.id === id) {
        setCurrentItem(prev => ({ ...prev, ...data }));
      }
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating inventory item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete an inventory item
  const deleteItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteInventoryItem(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      if (currentItem && currentItem.id === id) {
        setCurrentItem(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting inventory item:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load items on initial mount
  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    currentItem,
    loadItems,
    loadItem,
    addItem,
    updateItem,
    deleteItem
  };
};
