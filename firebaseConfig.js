// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5sVNT2sWp6pHLNIYYMrGNBibVCZVXOzc",
  authDomain: "worki-4cbec.firebaseapp.com",
  projectId: "worki-4cbec",
  storageBucket: "worki-4cbec.firebasestorage.app",
  messagingSenderId: "88823301843",
  appId: "1:88823301843:web:b9901803dfef2d2e83b626",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
