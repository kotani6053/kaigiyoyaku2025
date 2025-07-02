// src/App.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import ReservationForm from "./components/ReservationForm";
import CalendarView from "./components/CalendarView";

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2025-07-02");

  const fetchReservations = async () => {
    const snapshot = await getDocs(collection(db, "reservations"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReservations(data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    console.log("全予約データ", reservations);
  }, [reservations]);

  return (
    <div className="max-w-2xl mx-auto mt-4 p-4">
      {/* 必要なら日付変更UIをここに入れる */}
      <ReservationForm selectedDate={selectedDate} onReserved={fetchReservations} />
      <CalendarView reservations={reservations} selectedDate={selectedDate} />
    </div>
  );
};

export default App;
