import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  addDoc,
  collection,
  deleteField,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBOVzDSqrPSqwm6AFCNbu91IKK4yy0gCqM',
  authDomain: 'aethel-30d56.firebaseapp.com',
  projectId: 'aethel-30d56',
  storageBucket: 'aethel-30d56.firebasestorage.app',
  messagingSenderId: '295550667308',
  appId: '1:295550667308:web:56f48be4d5442ed308df89'
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app, 'us-central1');
export { httpsCallable };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
  EmailAuthProvider,
  addDoc,
  collection,
  createUserWithEmailAndPassword,
  deleteField,
  deleteDoc,
  deleteObject,
  doc,
  getDoc,
  getDownloadURL,
  getDocs,
  onAuthStateChanged,
  onSnapshot,
  orderBy,
  limit,
  query,
  reauthenticateWithCredential,
  ref,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateDoc,
  uploadBytes,
  where,
  writeBatch
};
