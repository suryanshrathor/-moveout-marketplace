// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';

// Your Firebase configuration (replace with yours)
const firebaseConfig = {
  apiKey: "AIzaSyCKBMldILY0-P9L19ocOt-qapihB7LPUCU",
  authDomain: "moveout-marketplace-9abf6.firebaseapp.com",
  projectId: "moveout-marketplace-9abf6",
  storageBucket: "moveout-marketplace-9abf6.firebasestorage.app",
  messagingSenderId: "508633577907",
  appId: "1:508633577907:web:15df862730971ff6cbf3c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
