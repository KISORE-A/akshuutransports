import React, { useState, useEffect } from "react";
import "./Notifications.css";

export default function Notifications() {
  const [items, setItems] = useState([
    "⚠️ Bus delayed due to rain",
    "🔁 Driver changed for Route 3",
    "📅 Holiday on next Monday",
    "🛠️ Bus 104 is under maintenance",
    "📢 New route added to North Campus",
    "🚧 Heavy traffic reported on High Bridge",
    "🚌 Track your bus live on the map",
    "✅ Attendance confirmed for today"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) => {
        // Shuffle logic
        const shuffled = [...prevItems];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card notification-card">
      <h3>🔔 Notifications</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="fade-in">{item}</li>
        ))}
      </ul>
    </div>
  );
}
