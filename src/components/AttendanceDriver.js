import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import QrReader from "react-qr-reader";

function AttendanceDriver() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [active, setActive] = useState(false);

  // ✅ Generate 6-digit OTP
  const generateOTP = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setTimeLeft(10);
    setActive(true);
  };

  // ⏱️ 10 sec timer
  useEffect(() => {
    if (!active) return;

    if (timeLeft === 0) {
      setActive(false);
      setOtp("");
      alert("OTP Expired ❌");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, active]);

  // 📷 Scan QR (IMPORTANT FIX)
  const handleScan = (data) => {
    if (data && data === otp && active) {
      alert("Attendance Marked Successfully ✅");
      setActive(false);
      setOtp("");
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🧑‍✈️ Driver Attendance Panel</h2>

      {!active && (
        <button onClick={generateOTP}>
          Generate 6-Digit OTP & QR
        </button>
      )}

      {active && (
        <>
          <h3>OTP: {otp}</h3>
          <p>⏳ Time Left: {timeLeft} sec</p>

          <div
            style={{
              background: "#fff",
              padding: "12px",
              display: "inline-block",
            }}
          >
            <QRCode value={otp} size={180} />
          </div>

          <div style={{ marginTop: "20px" }}>
            <QrReader
              delay={300}
              onScan={handleScan}
              onError={handleError}
              style={{ width: "300px" }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AttendanceDriver;
