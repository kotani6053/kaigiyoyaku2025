import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const App = () => {
  const [view, setView] = useState("form");
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "役員",
    purpose: "",
    guest: "",
    room: "1階食堂",
    date: "",
    startTime: "08:30",
    endTime: "08:40"
  });

  // 10分刻み時間配列生成
  const timeOptions = [];
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === 18 && m > 0) break;
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      timeOptions.push(`${hh}:${mm}`);
    }
  }

  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "reservations"), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Firestore予約データ取得:", data); // デバッグ用
    setReservations(data);
  }, (error) => {
    console.error("onSnapshotエラー:", error); // エラーハンドリング
  });
  return () => unsubscribe();
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isOverlapping = (s1, e1, s2, e2) => {
    return Math.max(s1, s2) < Math.min(e1, e2);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const s1 = toMinutes(formData.startTime);
  const e1 = toMinutes(formData.endTime);

  if (s1 >= e1) {
    alert("終了時間は開始時間より後にしてください。");
    return;
  }

  const duplicate = reservations.find((r) => {
    return (
      r.date === formData.date &&
      r.room === formData.room &&
      isOverlapping(s1, e1, toMinutes(r.startTime), toMinutes(r.endTime))
    );
  });

  if (duplicate) {
    alert("この時間帯はすでに予約されています。");
    return;
  }

  try {
    await addDoc(collection(db, "reservations"), formData);
    alert("予約が完了しました。初期画面に戻ります。");
    setView("form");

    setFormData({
      name: "",
      department: "役員",
      purpose: "",
      guest: "",
      room: "1階食堂",
      date: "",
      startTime: "08:30",
      endTime: "08:40"
    });
  } catch (error) {
    alert("Firestoreへの予約登録に失敗しました：" + error.message);
    console.error("addDocエラー:", error);
  }
};

    const s1 = toMinutes(formData.startTime);
    const e1 = toMinutes(formData.endTime);

    if (s1 >= e1) {
      alert("終了時間は開始時間より後にしてください。");
      return;
    }

    const duplicate = reservations.find((r) => {
      return (
        r.date === formData.date &&
        r.room === formData.room &&
        isOverlapping(
          s1,
          e1,
          toMinutes(r.startTime),
          toMinutes(r.endTime)
        )
      );
    });

    if (duplicate) {
      alert("この時間帯はすでに予約されています。");
      return;
    }

    await addDoc(collection(db, "reservations"), formData);
    alert("予約が完了しました。初期画面に戻ります。");
    setView("form");

    setFormData({
      name: "",
      department: "役員",
      purpose: "",
      guest: "",
      room: "1階食堂",
      date: "",
      startTime: "08:30",
      endTime: "08:40"
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "reservations", id));
  };

  const groupedReservations = () => {
    const sorted = [...reservations].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.room !== b.room) return a.room.localeCompare(b.room);
      return a.startTime.localeCompare(b.startTime);
    });

    const grouped = {};
    sorted.forEach((r) => {
      if (!grouped[r.date]) grouped[r.date] = {};
      if (!grouped[r.date][r.room]) grouped[r.date][r.room] = [];
      grouped[r.date][r.room].push(r);
    });
    return grouped;
  };

  return (
    <div className="p-6 font-sans text-lg max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">KOTANI会議室予約アプリ</h1>
      <div className="mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4" onClick={() => setView("form")}>予約</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setView("list")}>一覧</button>
      </div>

      {view === "form" && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            name="name"
            placeholder="名前"
            value={formData.name}
            onChange={handleChange}
            required
            className="text-lg p-2 border rounded"
          />
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="text-lg p-2 border rounded"
          >
            <option value="役員">役員</option>
            <option value="新門司手摺">新門司手摺</option>
            <option value="新門司セラミック">新門司セラミック</option>
            <option value="総務部">総務部</option>
            <option value="その他">その他</option>
          </select>
          <input
            name="purpose"
            placeholder="使用目的"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="text-lg p-2 border rounded"
          />
          <input
            name="guest"
            placeholder="来客者名"
            value={formData.guest}
            onChange={handleChange}
            className="text-lg p-2 border rounded"
          />
          <select
            name="room"
            value={formData.room}
            onChange={handleChange}
            className="text-lg p-2 border rounded"
          >
            <option value="1階食堂">1階食堂</option>
            <option value="2階会議室①">2階会議室①</option>
            <option value="2階会議室②">2階会議室②</option>
            <option value="3階会議室">3階会議室</option>
            <option value="応接室">応接室</option>
          </select>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="text-lg p-2 border rounded"
          />

          <label className="font-semibold">開始時間</label>
          <select
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="text-lg p-2 border rounded"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label className="font-semibold">終了時間</label>
          <select
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="text-lg p-2 border rounded"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded text-xl">予約する</button>
        </form>
      )}

      {view === "list" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">予約一覧</h2>
          {Object.entries(groupedReservations()).map(([date, rooms]) => (
            <div key={date} className="mb-6">
              <h3 className="text-xl font-bold mb-2">📅 {date}</h3>
              {Object.entries(rooms).map(([room, entries]) => (
                <div key={room} className="mb-2">
                  <h4 className="text-lg font-semibold mb-1">🏢 {room}</h4>
                  <ul className="ml-4">
                    {entries.map((r) => (
                      <li key={r.id} className="mb-1">
                        {r.startTime} ～ {r.endTime} - {r.name}（{r.department}） / {r.purpose} {r.guest && `/ 来客: ${r.guest}`}
                        <button onClick={() => handleDelete(r.id)} className="text-red-500 ml-4 hover:underline">削除</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
