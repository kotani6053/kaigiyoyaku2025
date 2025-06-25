import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [view, setView] = useState("form");
  const [reservations, setReservations] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    purpose: "",
    guest: "",
    room: "会議室",
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

  const handleAdminLogin = () => {
    const code = prompt("パスコードを入力してください：");
    if (code === "kotani6051") {
      setAdminMode(true);
      setView("admin");
    } else {
      alert("パスコードが間違っています。");
    }
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
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => setView("list")}
        >一覧</button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleAdminLogin}
        >管理者</button>
      </div>

      {view === "form" && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 max-w-md">
          <input name="name" placeholder="名前" value={formData.name} onChange={handleChange} required />
          <input name="department" placeholder="部署" value={formData.department} onChange={handleChange} required />
          <input name="purpose" placeholder="使用目的" value={formData.purpose} onChange={handleChange} required />
          <input name="guest" placeholder="来客者名" value={formData.guest} onChange={handleChange} />
          <select name="room" value={formData.room} onChange={handleChange}>
  <option value="1階食堂">1階食堂</option>
  <option value="2階会議室①">2階会議室①</option>
  <option value="2階会議室②">2階会議室②</option>
  <option value="3階会議室">3階会議室</option>
  <option value="応接室">応接室</option>
  <select name="time" value={formData.time} onChange={handleChange} required>
  {generateTimes("08:30", "18:00", 10).map((t) => (
    <option key={t} value={t}>{t}</option>
  ))}
  </select>          
          <input name="date" type="date" value={formData.date} onChange={handleChange} required />
          <input
  name="time"
  type="time"
  step="600"
  min="08:30"
  max="18:00"
  value={formData.time}
  onChange={handleChange}
  required
/>

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

      {view === "admin" && adminMode && (
        <div>
          <h2 className="text-xl font-semibold mb-2">管理者モード</h2>
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
