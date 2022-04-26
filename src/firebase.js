import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB5OhrV6i_RuOw44cDgWjd0ujdXxhnVB44',
  authDomain: 'raphael-wishlist.firebaseapp.com',
  projectId: 'raphael-wishlist',
  storageBucket: 'raphael-wishlist.appspot.com',
  messagingSenderId: '20760194101',
  appId: '1:20760194101:web:982bc1b2d4527e3d2e557c',
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
if (import.meta.env.DEV) connectAuthEmulator(auth, 'http://localhost:9082');

export const db9 = getFirestore(firebaseApp);
if (import.meta.env.DEV) connectFirestoreEmulator(db9, 'localhost', 9081);
