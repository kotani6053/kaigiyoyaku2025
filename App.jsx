// src/components/ReservationForm.jsx

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // ← Firebase接続ファイル

const ReservationForm = ({ selectedDate }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [guest, setGuest] = useState("");
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("09:00");

  // 🔧 10分単位の時間スロットを作る関数
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let min = 0; min < 60; min += 10) {
        const h = String(hour).padStart(2, "0");
        const m = String(min).padStart(2, "0");
        times.push(`${h}:${m}`);
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

    // フォームクリア
    setName("");
    setDepartment("");
    setPurpose("");
    setGuest("");
    setStartTime("08:30");
    setEndTime("09:00");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">予約フォーム</h2>

      <div className="mb-2">
        <label className="block text-sm font-medium">名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">部署</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          className="border p-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">使用目的</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          className="border p-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">来客者名（任意）</label>
        <input
          type="text"
          value={guest}
          onChange={(e) => setGuest(e.target.value)}
          className="border p-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">開始時間</label>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-1 w-full rounded"
        >
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">終了時間</label>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-1 w-full rounded"
        >
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        予約する
      </button>
    </form>
  );
};

export default ReservationForm;
