import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqUmYO3KznEJaSzfHkwh3ULX-LNoR8f1c",
  authDomain: "medical-dd248.firebaseapp.com",
  projectId: "medical-dd248",
  storageBucket: "medical-dd248.appspot.com",
  messagingSenderId: "518789872630",
  appId: "1:518789872630:web:26312948308685fde225d7",
  measurementId: "G-KK8QYSE6NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to store user data
const storeUserData = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

// Function to load user data
const loadUserData = async () => {
  const userJson = await AsyncStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};

// Auth State Change Listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    await storeUserData(user);
    console.log('User signed in');
  } else {
    // User is signed out
    console.log('User signed out');
    await AsyncStorage.removeItem('user');
  }
});

export { auth, db };

