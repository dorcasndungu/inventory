import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'inventory';

/**
 * Add a new inventory item
 * @param {Object} item - The item to add
 * @returns {Promise<string>} - The ID of the added item
 */
export const addInventoryItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

/**
 * Get all inventory items
 * @returns {Promise<Array>} - Array of inventory items
 */
export const getInventoryItems = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error getting inventory items:', error);
    throw error;
  }
};

/**
 * Get a single inventory item by ID
 * @param {string} id - The ID of the item to get
 * @returns {Promise<Object>} - The inventory item
 */
export const getInventoryItem = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error getting inventory item:', error);
    throw error;
  }
};

/**
 * Update an inventory item
 * @param {string} id - The ID of the item to update
 * @param {Object} data - The data to update
 * @returns {Promise<void>}
 */
export const updateInventoryItem = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

/**
 * Delete an inventory item
 * @param {string} id - The ID of the item to delete
 * @returns {Promise<void>}
 */
export const deleteInventoryItem = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

/**
 * Update inventory item quantity (for sales)
 * @param {string} id - The ID of the item
 * @param {number} quantity - The quantity to subtract
 * @returns {Promise<void>}
 */
export const updateInventoryQuantity = async (id, quantity) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().units || 0;
      if (currentQuantity < quantity) {
        throw new Error('Not enough items in stock');
      }
      
      await updateDoc(docRef, {
        units: currentQuantity - quantity,
        updatedAt: serverTimestamp()
      });
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error updating inventory quantity:', error);
    throw error;
  }
};
