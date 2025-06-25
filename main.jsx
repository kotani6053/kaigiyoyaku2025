import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const generateTimeOptions = () => {
  const options = [];
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 10) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      const time = `${hour}:${minute}`;
      if (time >= "08:30" && time <= "18:00") {
        options.push(time);
      }
    }
  }
  return options;
};

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
    alert("予約が完了しました。初期画面に戻ります。");
    setView("form");
  };

  const handleDelete = (index) => {
    const updated = [...reservations];
    updated.splice(index, 1);
    setReservations(updated);
  };

  const groupedReservations = () => {
    const sorted = [...reservations].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.room !== b.room) return a.room.localeCompare(b.room);
      return a.time.localeCompare(b.time);
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
    <div className="p-8 font-sans text-xl">
      <h1 className="text-4xl font-bold mb-6">KOTANI 会議室予約アプリ</h1>
      <div className="mb-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded mr-4 text-xl" onClick={() => setView("form")}>予約</button>
        <button className="bg-green-600 text-white px-6 py-3 rounded text-xl" onClick={() => setView("list")}>一覧</button>
      </div>

      {view === "form" && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
          <input name="name" placeholder="名前" value={formData.name} onChange={handleChange} required className="text-xl p-3 border rounded" />
          <select name="department" value={formData.department} onChange={handleChange} className="text-xl p-3 border rounded">
            <option value="役員">役員</option>
            <option value="新門司手摺">新門司手摺</option>
            <option value="新門司セラミック">新門司セラミック</option>
            <option value="総務部">総務部</option>
            <option value="その他">その他</option>
          </select>
          <input name="purpose" placeholder="使用目的" value={formData.purpose} onChange={handleChange} required className="text-xl p-3 border rounded" />
          <input name="guest" placeholder="来客者名" value={formData.guest} onChange={handleChange} className="text-xl p-3 border rounded" />
          <select name="room" value={formData.room} onChange={handleChange} className="text-xl p-3 border rounded">
            <option value="1階食堂">1階食堂</option>
            <option value="2階会議室①">2階会議室①</option>
            <option value="2階会議室②">2階会議室②</option>
            <option value="3階会議室">3階会議室</option>
            <option value="応接室">応接室</option>
          </select>
          <input name="date" type="date" value={formData.date} onChange={handleChange} required className="text-xl p-3 border rounded" />
          <select name="time" value={formData.time} onChange={handleChange} required className="text-xl p-3 border rounded">
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <button className="bg-blue-700 text-white px-6 py-3 rounded text-xl">予約する</button>
        </form>
      )}

      {view === "list" && (
        <div>
          <h2 className="text-3xl font-semibold mb-4">予約一覧</h2>
          {Object.entries(groupedReservations()).map(([date, rooms]) => (
            <div key={date} className="mb-8">
              <h3 className="text-2xl font-bold mb-2">📅 {date}</h3>
              {Object.entries(rooms).map(([room, entries]) => (
                <div key={room} className="mb-4">
                  <h4 className="text-xl font-semibold mb-1">🏢 {room}</h4>
                  <ul className="ml-6">
                    {entries.map((r, i) => (
                      <li key={i} className="mb-1">
                        {r.time} - {r.name}（{r.department}） / {r.purpose} {r.guest && `/ 来客: ${r.guest}`}
                        <button onClick={() => handleDelete(i)} className="text-red-500 ml-4 hover:underline">削除</button>
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
