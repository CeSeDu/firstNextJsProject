// pages/api/firebase-admin.js

import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

if (!admin.apps.length && typeof window === 'undefined') {
    // Sadece sunucu tarafında çalıştırın
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://first-firebase-project-bb421-default-rtdb.firebaseio.com"
  });
}

export default admin;
