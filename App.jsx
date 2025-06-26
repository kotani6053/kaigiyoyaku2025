import React from 'react'; export default function App() { return <h1>KOTANI会議室予約アプリ</h1>; }
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
