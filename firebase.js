// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase設定（正確なstorageBucketに注意）
const firebaseConfig = {
  apiKey: "AIzaSyBtLFNwnAqBYFR7eFi-bKaT4Vq9Zu15a6I",
  authDomain: "kotaniapp-4f017.firebaseapp.com",
  projectId: "kotaniapp-4f017",
  storageBucket: "kotaniapp-4f017.appspot.com",
  messagingSenderId: "623409374889",
  appId: "1:623409374889:web:8aba02fed565f56c23abb8"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
