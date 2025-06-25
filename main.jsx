import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const generateTimes = (start, end, intervalMinutes) => {
  const times = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m <= endM)) {
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    times.push(formatted);
    m += intervalMinutes;
    if (m >= 60) {
      m = m % 60;
      h++;
    }
  }
  return times;
};

const App = () => {
  const [view, setView] = useState("form");
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    purpose: "",
    guest: "",
    room: "応接室",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const duplicate = reservations.find(
      (r) => r.date === formData.date && r.time === formData.time && r.room === formData.room
    );
    if (duplicate) {
      alert("この時間帯はすでに予約されています。");
      return;
    }
    setReservations([...reservations, formData]);
    alert("予約が完了しました。");
  };

  const handleDelete = (index) => {
    const updated = [...reservations];
    updated.splice(index, 1);
    setReservations(updated);
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">会議室予約アプリ</h1>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setView("form")}
        >予約</button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setView("list")}
        >一覧</button>
      </div>

      {view === "form" && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 max-w-md">
          <input name="name" placeholder="名前" value={formData.name} onChange={handleChange} required />
          
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">部署を選択してください</option>
            <option value="役員">役員</option>
            <option value="新門司手摺">新門司手摺</option>
            <option value="新門司セラミック">新門司セラミック</option>
            <option value="総務部">総務部</option>
            <option value="その他">その他</option>
          </select>

          <input name="purpose" placeholder="使用目的" value={formData.purpose} onChange={handleChange} required />
          <input name="guest" placeholder="来客者名" value={formData.guest} onChange={handleChange} />

          <select name="room" value={formData.room} onChange={handleChange}>
            <option value="2階会議室①">2階会議室①</option>
            <option value="2階会議室②">2階会議室②</option>
            <option value="3階会議室">3階会議室</option>
            <option value="応接室">応接室</option>
            <option value="1階食堂">1階食堂</option>

          </select>

          <input name="date" type="date" value={formData.date} onChange={handleChange} required />

          <select name="time" value={formData.time} onChange={handleChange} required>
            <option value="">時間を選択</option>
            {generateTimes("08:30", "18:00", 10).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">予約する</button>
        </form>
      )}

      {view === "list" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">予約一覧</h2>
          <ul>
            {reservations.map((r, i) => (
              <li key={i} className="border-b py-1 flex justify-between items-center">
                {r.date} {r.time} [{r.room}] - {r.name} ({r.department}) / {r.purpose} {r.guest && `/ 来客: ${r.guest}`}
                <button
                  className="text-red-500 hover:underline ml-4"
                  onClick={() => handleDelete(i)}
                >削除</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
