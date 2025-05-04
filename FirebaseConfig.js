// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD5sVNT2sWp6pHLNIYYMrGNBibVCZVXOzc",
  authDomain: "worki-4cbec.firebaseapp.com",
  projectId: "worki-4cbec",
  storageBucket: "worki-4cbec.firebasestorage.app",
  messagingSenderId: "88823301843",
  appId: "1:88823301843:web:b9901803dfef2d2e83b626",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
// export const auth = getAuth(app);
