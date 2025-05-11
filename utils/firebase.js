import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGf56DgK9zZeYr9fHrNhgF4pytP9oRCuQ",
  authDomain: "ndungu-shop.firebaseapp.com",
  projectId: "ndungu-shop",
  storageBucket: "ndungu-shop.firebasestorage.app",
  messagingSenderId: "922809103168",
  appId: "1:922809103168:web:b6c6931ba3570c887540a5",
  measurementId: "G-M6KJQTHX6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };

