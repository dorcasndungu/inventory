import { useState, useEffect } from 'react';
import { 
  getSales, 
  getRecentSales, 
  getSalesByDateRange, 
  recordSale 
} from '../utils/salesService';

/**
 * Custom hook to manage sales
 * @returns {Object} - Sales state and functions
 */
export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all sales
  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSales();
      setSales(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading sales:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load recent sales
  const loadRecentSales = async (count = 5) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecentSales(count);
      setRecentSales(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error loading recent sales:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load sales by date range
  const loadSalesByDateRange = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSalesByDateRange(startDate, endDate);
      setSales(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error loading sales by date range:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Record a new sale
  const addSale = async (sale) => {
    try {
      setLoading(true);
      setError(null);
      const id = await recordSale(sale);
      const newSale = { ...sale, id, saleDate: new Date() };
      setSales(prevSales => [newSale, ...prevSales]);
      setRecentSales(prevSales => {
        const updated = [newSale, ...prevSales];
        return updated.slice(0, 5); // Keep only the 5 most recent
      });
      return id;
    } catch (err) {
      setError(err.message);
      console.error('Error recording sale:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculate total sales amount
  const calculateTotalSales = () => {
    return sales.reduce((total, sale) => {
      return total + (sale.price * sale.quantity);
    }, 0);
  };

  // Load sales on initial mount
  useEffect(() => {
    loadSales();
    loadRecentSales();
  }, []);

  return {
    sales,
    recentSales,
    loading,
    error,
    loadSales,
    loadRecentSales,
    loadSalesByDateRange,
    addSale,
    calculateTotalSales
  };
};
