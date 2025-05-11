import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Item } from '../types';
import { uploadImageToCloudinary } from '../utils/cloudinary';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const itemsQuery = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(itemsQuery);
      const itemsList: Item[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Item, 'id'>;
        itemsList.push({
          id: doc.id,
          ...data,
        });
      });
      
      setItems(itemsList);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single item by ID
  const fetchItem = async (id: string): Promise<Item | null> => {
    try {
      const docRef = doc(db, 'items', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data() as Omit<Item, 'id'>,
        };
      } else {
        setError('Item not found');
        return null;
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Failed to fetch item');
      return null;
    }
  };

  // Add a new item
  const addItem = async (item: Omit<Item, 'id' | 'createdAt' | 'imageUrl'>, imageUri: string): Promise<string | null> => {
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageUri);
      
      // Add item to Firestore
      const docRef = await addDoc(collection(db, 'items'), {
        ...item,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      
      // Refresh items list
      fetchItems();
      
      return docRef.id;
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item');
      return null;
    }
  };

  // Update an existing item
  const updateItem = async (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt'>>, newImageUri?: string): Promise<boolean> => {
    try {
      const updateData: Partial<Omit<Item, 'id'>> = { ...updates };
      
      // If a new image is provided, upload it to Cloudinary
      if (newImageUri) {
        const imageUrl = await uploadImageToCloudinary(newImageUri);
        updateData.imageUrl = imageUrl;
      }
      
      // Update item in Firestore
      const docRef = doc(db, 'items', id);
      await updateDoc(docRef, updateData);
      
      // Refresh items list
      fetchItems();
      
      return true;
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
      return false;
    }
  };

  // Delete an item
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'items', id));
      
      // Refresh items list
      fetchItems();
      
      return true;
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
      return false;
    }
  };

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    fetchItem,
    addItem,
    updateItem,
    deleteItem,
  };
};
