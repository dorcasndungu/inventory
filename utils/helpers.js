/**
 * Format a date to a readable string
 * @param {Date|Object|string} date - The date to format (can be Date, Firestore Timestamp, or string)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';

  let dateObj;

  // Handle different date formats
  if (typeof date === 'string') {
    // If date is a string, convert to Date object
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    // If date is already a Date object
    dateObj = date;
  } else if (typeof date === 'object' && date.toDate) {
    // If date is a Firestore Timestamp
    dateObj = date.toDate();
  } else if (typeof date === 'object' && date.seconds) {
    // If date is a Firestore Timestamp-like object
    dateObj = new Date(date.seconds * 1000);
  } else {
    // Fallback
    return String(date);
  }

  // Check if dateObj is a valid Date
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  // Format the date
  try {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateObj);
  }
};

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'KES 0';
  return `KES ${amount.toLocaleString()}`;
};

/**
 * Calculate profit from buying and selling price
 * @param {number} buyingPrice - The buying price
 * @param {number} sellingPrice - The selling price
 * @returns {number} - The profit
 */
export const calculateProfit = (buyingPrice, sellingPrice) => {
  return sellingPrice - buyingPrice;
};

/**
 * Calculate profit margin as a percentage
 * @param {number} buyingPrice - The buying price
 * @param {number} sellingPrice - The selling price
 * @returns {string} - The profit margin as a percentage
 */
export const calculateProfitMargin = (buyingPrice, sellingPrice) => {
  if (!buyingPrice || buyingPrice === 0) return '0%';
  const profit = calculateProfit(buyingPrice, sellingPrice);
  const margin = (profit / buyingPrice) * 100;
  return `${margin.toFixed(2)}%`;
};

/**
 * Validate an inventory item
 * @param {Object} item - The item to validate
 * @returns {Object} - Validation result
 */
export const validateInventoryItem = (item) => {
  const errors = {};

  if (!item.name || item.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!item.price || isNaN(item.price) || item.price <= 0) {
    errors.price = 'Price must be a positive number';
  }

  if (!item.buyingPrice || isNaN(item.buyingPrice) || item.buyingPrice <= 0) {
    errors.buyingPrice = 'Buying price must be a positive number';
  }

  if (!item.units || isNaN(item.units) || item.units < 0) {
    errors.units = 'Units must be a non-negative number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate a sale
 * @param {Object} sale - The sale to validate
 * @returns {Object} - Validation result
 */
export const validateSale = (sale) => {
  const errors = {};

  if (!sale.itemId) {
    errors.itemId = 'Item is required';
  }

  if (!sale.quantity || isNaN(sale.quantity) || sale.quantity <= 0) {
    errors.quantity = 'Quantity must be a positive number';
  }

  if (!sale.price || isNaN(sale.price) || sale.price <= 0) {
    errors.price = 'Price must be a positive number';
  }

  if (!sale.paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
