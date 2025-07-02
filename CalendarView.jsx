// src/components/CalendarView.jsx

import React from "react";

const timeSlots = [];
for (let h = 8; h <= 17; h++) {
  for (let m = 0; m < 60; m += 10) {
    timeSlots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}
timeSlots.push("18:00");

const CalendarView = ({ reservations, selectedDate }) => {
  const reservationsForDate = reservations.filter((r) => r.date === selectedDate);

  const getReservationAt = (time) => {
    return reservationsForDate.find((r) => {
      const [sh, sm] = r.startTime.split(":").map(Number);
      const [eh, em] = r.endTime.split(":").map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      const current = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
      return current >= start && current < end;
    });
  };

  return (
    <div className="mt-4 border rounded overflow-hidden">
      <div className="bg-gray-100 p-2 font-bold text-center">{selectedDate} の予約状況</div>
      <table className="w-full table-fixed text-sm">
        <tbody>
          {timeSlots.map((time) => {
            const res = getReservationAt(time);
            return (
              <tr key={time} className="border-b">
                <td className="w-24 p-1 text-right pr-2 font-mono">{time}</td>
                <td className="p-1">
                  {res ? (
                    <div className="bg-red-100 border-l-4 border-red-500 pl-2 py-1 rounded">
                      {res.name}（{res.department}）<br />
                      {res.purpose}
                    </div>
                  ) : (
                    <span className="text-gray-400">空き</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarView;
