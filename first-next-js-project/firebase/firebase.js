import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite'; 
import admin from '../api/firebase-admn.js';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase client-side uygulamasını başlatın
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore bağlantısını oluşturun ve dışa aktarın

// Firebase Admin SDK yapılandırması


export { db }; // Firestore bağlantısını ve Firebase Admin SDK'yı dışa aktarın