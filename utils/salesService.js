import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where
} from 'firebase/firestore';
import { db } from './firebase';
import { updateInventoryQuantity } from './inventoryService';

const COLLECTION_NAME = 'sales';

/**
 * Record a new sale
 * @param {Object} sale - The sale to record
 * @returns {Promise<string>} - The ID of the recorded sale
 */
export const recordSale = async (sale) => {
  try {
    // First update the inventory quantity
    await updateInventoryQuantity(sale.itemId, sale.quantity);

    // Ensure description exists
    const saleWithDefaults = {
      ...sale,
      description: sale.description || `Sale of ${sale.quantity} ${sale.itemName || 'item'}`,
      saleDate: serverTimestamp(),
      createdAt: serverTimestamp()
    };

    // Then record the sale
    const docRef = await addDoc(collection(db, COLLECTION_NAME), saleWithDefaults);

    return docRef.id;
  } catch (error) {
    console.error('Error recording sale:', error);
    throw error;
  }
};

/**
 * Get all sales
 * @returns {Promise<Array>} - Array of sales
 */
export const getSales = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('saleDate', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      saleDate: doc.data().saleDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error getting sales:', error);
    throw error;
  }
};

/**
 * Get recent sales
 * @param {number} count - Number of recent sales to get
 * @returns {Promise<Array>} - Array of recent sales
 */
export const getRecentSales = async (count = 5) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('saleDate', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      saleDate: doc.data().saleDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error getting recent sales:', error);
    throw error;
  }
};

/**
 * Get sales for a specific date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} - Array of sales in the date range
 */
export const getSalesByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('saleDate', '>=', Timestamp.fromDate(startDate)),
      where('saleDate', '<=', Timestamp.fromDate(endDate)),
      orderBy('saleDate', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      saleDate: doc.data().saleDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error getting sales by date range:', error);
    throw error;
  }
};
