import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isRealKey = apiKey && apiKey !== "your-api-key" && !apiKey.startsWith("AIzaSyMockKey");

const firebaseConfig = {
  apiKey: isRealKey ? apiKey : "AIzaSyDummyKeyForDevelopmentOnly1234567",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "orange-energy-liberia.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "orange-energy-liberia",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "orange-energy-liberia.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

// Singleton App pattern
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use getFirestore(app) to prevent duplicate initialization errors across HMR & re-imports
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'africa-south1');

export default app;