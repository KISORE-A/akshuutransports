import React, { useState } from "react";
import QrReader from "react-qr-reader";

function AttendanceStudent() {
  const [enteredOtp, setEnteredOtp] = useState("");

  const submitOTP = () => {
    if (enteredOtp.length !== 6) {
      alert("Enter valid 6-digit OTP ❌");
      return;
    }

    const userId = localStorage.getItem("userId") || "unknown";
    const key = "attendance";
    const raw = localStorage.getItem(key);
    const attendance = raw ? JSON.parse(raw) : {};
    const today = new Date().toISOString().slice(0, 10);

    attendance[userId] = attendance[userId] || [];
    if (!attendance[userId].includes(today)) {
      attendance[userId].push(today);
    }

    localStorage.setItem(key, JSON.stringify(attendance));
    alert("OTP Submitted Successfully ✅");
  };

  // ✅ CORRECT handler for react-qr-reader
  const handleScan = (data) => {
    if (data) {
      const userId = localStorage.getItem("userId") || "unknown";
      const key = "attendance";
      const raw = localStorage.getItem(key);
      const attendance = raw ? JSON.parse(raw) : {};
      const today = new Date().toISOString().slice(0, 10);

      attendance[userId] = attendance[userId] || [];
      if (!attendance[userId].includes(today)) {
        attendance[userId].push(today);
      }

      localStorage.setItem(key, JSON.stringify(attendance));
      alert("QR Scanned Successfully ✅\nOTP: " + data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎓 Student Attendance</h2>

      <h4>📷 Scan QR Code</h4>
      <QrReader
        delay={300}
        onScan={handleScan}
        onError={handleError}
        style={{ width: "280px", margin: "auto" }}
      />

      <h4>OR Enter OTP</h4>
      <input
        type="text"
        maxLength="6"
        value={enteredOtp}
        onChange={(e) =>
          setEnteredOtp(e.target.value.replace(/\D/g, ""))
        }
        placeholder="Enter 6-digit OTP"
      />
      <br />
      <button onClick={submitOTP}>Submit OTP</button>
    </div>
  );
}

export default AttendanceStudent;
