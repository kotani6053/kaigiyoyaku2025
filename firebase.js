// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = { /* あなたの設定 */ };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
