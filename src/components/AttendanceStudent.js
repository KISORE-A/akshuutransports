import React, { useState } from "react";
import QrReader from "react-qr-reader";
import { markAttendance } from "../services/api";

function AttendanceStudent() {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const getStudentId = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr).id : null;
  };

  const handleAttendance = async (status) => {
    const studentId = getStudentId();
    if (!studentId) {
      alert("User not found locally. Please login again.");
      return;
    }

    setLoading(true);
    try {
      await markAttendance(studentId, status);
      alert(`Attendance marked successfully! (${status}) ✅`);
    } catch (err) {
      alert("Error marking attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitOTP = () => {
    if (enteredOtp.length !== 6) {
      alert("Enter valid 6-digit OTP ❌");
      return;
    }
    handleAttendance(`OTP: ${enteredOtp}`);
  };

  const handleScan = (data) => {
    if (data) {
      handleAttendance(`QR: ${data}`);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="card attendance-card">
      <h3>🎓 Student Attendance</h3>

      <div className="attendance-qr" style={{ marginBottom: 12 }}>
        <h4 style={{ margin: 0 }}>📷 Scan QR Code</h4>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <QrReader
            delay={300}
            onScan={handleScan}
            onError={handleError}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="attendance-otp">
        <h4>OR Enter OTP</h4>
        <div className="otp-input-group">
          <input
            type="text"
            maxLength="6"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit Code"
            style={{ marginBottom: 0 }}
          />
          <button onClick={submitOTP} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
            {loading ? "..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendanceStudent;
