// src/components/ReservationForm.jsx
import React, { useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ReservationForm = ({ selectedDate, onReserved }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [guest, setGuest] = useState("");
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("08:40");

  // 時間の重複チェック関数
  const isOverlapping = (start1, end1, start2, end2) => {
    return Math.max(start1, start2) < Math.min(end1, end2);
  };

  // 文字列"HH:mm"を分に変換
  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 10) {
        times.push(`${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
      }
    }
    times.push("18:00");
    return times;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (startTime >= endTime) {
      alert("終了時間は開始時間より後にしてください。");
      return;
    }

    const querySnapshot = await getDocs(collection(db, "reservations"));
    const existingReservations = querySnapshot.docs
      .map(doc => doc.data())
      .filter(r => r.date === selectedDate);

    const s1 = toMinutes(startTime);
    const e1 = toMinutes(endTime);

    for (let r of existingReservations) {
      const s2 = toMinutes(r.startTime);
      const e2 = toMinutes(r.endTime);
      if (isOverlapping(s1, e1, s2, e2)) {
        alert(`この時間帯は既に予約があります（${r.startTime}〜${r.endTime}）`);
        return;
      }
    }

    await addDoc(collection(db, "reservations"), {
      date: selectedDate,
      name,
      department,
      purpose,
      guest,
      startTime,
      endTime,
      createdAt: new Date()
    });

    setName("");
    setDepartment("");
    setPurpose("");
    setGuest("");
    setStartTime("08:30");
    setEndTime("08:40");

    onReserved(); // 予約後に親へ通知して最新データを取得
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-lg font-bold mb-2">会議室予約フォーム</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="名前"
        required
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        value={department}
        onChange={e => setDepartment(e.target.value)}
        placeholder="部署"
        required
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        value={purpose}
        onChange={e => setPurpose(e.target.value)}
        placeholder="使用目的"
        required
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        value={guest}
        onChange={e => setGuest(e.target.value)}
        placeholder="来客者名（任意）"
      />

      <div className="flex gap-2 mb-4">
        <select
          className="w-1/2 p-2 border rounded"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        >
          {generateTimeOptions().map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="w-1/2 p-2 border rounded"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        >
          {generateTimeOptions().map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        予約する
      </button>
    </form>
  );
};

export default ReservationForm;
