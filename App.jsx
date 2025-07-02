import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitor, setVisitor] = useState("");
  const [room, setRoom] = useState("会議室");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reservations, setReservations] = useState([]);

  const reservationsRef = collection(db, "reservations");

  // Firestoreからリアルタイム取得
  useEffect(() => {
    const q = query(reservationsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });
    return () => unsubscribe();
  }, []);

  // 登録処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !department || !purpose || !date || !time) {
      alert("すべての項目を入力してください");
      return;
    }

    try {
      await addDoc(reservationsRef, {
        name,
        department,
        purpose,
        visitor,
        room,
        date,
        time,
        createdAt: new Date()
      });
      // 入力初期化
      setName("");
      setDepartment("");
      setPurpose("");
      setVisitor("");
      setRoom("会議室");
      setDate("");
      setTime("");
    } catch (error) {
      console.error("保存エラー:", error);
    }
  };

  // 削除処理
  const handleDelete = async (id) => {
    if (window.confirm("この予約を削除しますか？")) {
      await deleteDoc(doc(db, "reservations", id));
    }
  };

  return (
    <div className="App">
      <h1>会議室予約システム</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "400px" }}>
        <input type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="部署" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <input type="text" placeholder="使用目的" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        <input type="text" placeholder="来客者名（任意）" value={visitor} onChange={(e) => setVisitor(e.target.value)} />
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="会議室">会議室</option>
          <option value="応接室">応接室</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} step="1800" min="08:30" max="18:00" />
        <button type="submit">予約する</button>
      </form>

      <h2>予約一覧</h2>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {reservations.map(res => (
          <li key={res.id} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
            <strong>{res.date} {res.time}</strong> - {res.room} <br />
            {res.name}（{res.department}）{res.purpose && `：${res.purpose}`}
            {res.visitor && <span>｜来客: {res.visitor}</span>}
            <br />
            <button onClick={() => handleDelete(res.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
