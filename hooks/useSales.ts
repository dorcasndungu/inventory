import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Sale } from '../types';
import { db } from '../utils/firebase';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all sales
  const fetchSales = async () => {
    setLoading(true);
    try {
      const salesQuery = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(salesQuery);
      const salesList: Sale[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Sale, 'id'>;
        salesList.push({
          id: doc.id,
          ...data,
        });
      });

      setSales(salesList);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent sales (last 5)
  const loadRecentSales = async () => {
    setLoading(true);
    try {
      const salesQuery = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(salesQuery);
      const salesList: Sale[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Sale, 'id'>;
        salesList.push({
          id: doc.id,
          ...data,
        });
      });

      // Get only the 5 most recent sales
      setRecentSales(salesList.slice(0, 5));
      setError(null);
    } catch (err) {
      console.error('Error fetching recent sales:', err);
      setError('Failed to fetch recent sales');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single sale by ID
  const fetchSale = async (id: string): Promise<Sale | null> => {
    try {
      const docRef = doc(db, 'sales', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data() as Omit<Sale, 'id'>,
        };
      } else {
        setError('Sale not found');
        return null;
      }
    } catch (err) {
      console.error('Error fetching sale:', err);
      setError('Failed to fetch sale');
      return null;
    }
  };

  // Add a new sale
  const addSale = async (
    saleData: {
      itemId: string;
      itemName: string;
      quantity: number;
      price: number;
      paymentMethod: 'mpesa' | 'cash';
      description?: string;
    }
  ): Promise<string | null> => {
    try {
      // Create sale object with defaults
      const sale = {
        ...saleData,
        description: saleData.description || `Sale of ${saleData.quantity} ${saleData.itemName}`,
        saleDate: serverTimestamp() as any,
        createdAt: serverTimestamp() as any,
      };

      // Add sale to Firestore
      const docRef = await addDoc(collection(db, 'sales'), sale);

      // Refresh sales list
      fetchSales();

      return docRef.id;
    } catch (err) {
      console.error('Error adding sale:', err);
      setError('Failed to add sale');
      return null;
    }
  };

  // Fetch sales for a specific item
  const fetchSalesByItem = async (itemId: string): Promise<Sale[]> => {
    try {
      const salesQuery = query(
        collection(db, 'sales'),
        where('itemId', '==', itemId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(salesQuery);
      const salesList: Sale[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Sale, 'id'>;
        salesList.push({
          id: doc.id,
          ...data,
        });
      });

      return salesList;
    } catch (err) {
      console.error('Error fetching sales by item:', err);
      setError('Failed to fetch sales for this item');
      return [];
    }
  };

  // Calculate total sales amount
  const calculateTotalSales = (): number => {
    if (!sales || sales.length === 0) return 0;

    return sales.reduce((total, sale) => {
      const saleAmount = (sale.price || 0) * (sale.quantity || 0);
      return total + saleAmount;
    }, 0);
  };

  // Load sales on mount
  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    recentSales,
    loading,
    error,
    fetchSales,
    loadRecentSales,
    fetchSale,
    addSale,
    fetchSalesByItem,
    calculateTotalSales,
  };
};
