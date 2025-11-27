
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Configuração do cliente ConsegSeguro
const firebaseConfig = {
  apiKey: "AIzaSyDKJJYrQwWH7R-KeMzdxUbgpgxfZ4yhpi8",
  authDomain: "consegseguro-25a80.firebaseapp.com",
  projectId: "consegseguro-25a80",
  storageBucket: "consegseguro-25a80.firebasestorage.app",
  messagingSenderId: "987804882210",
  appId: "1:987804882210:web:4d5a3cbcb9c22da463817b",
  measurementId: "G-X7YEMG589Z"
};

// Initialize Firebase
let app: any;
let analytics: any;
let db: any;
let storage: any;
let auth: any;

try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log("Firebase Service Initialized with Analytics");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

export { 
    app,
    analytics,
    db, 
    storage, 
    auth, 
    collection, 
    addDoc, 
    serverTimestamp, 
    doc,
    updateDoc,
    query,
    orderBy,
    onSnapshot,
    ref, 
    uploadBytes, 
    getDownloadURL,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};
