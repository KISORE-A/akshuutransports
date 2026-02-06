import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate(); // ✅ ADD THIS

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please fill out Email ID or Mobile Number");
      return;
    }

    if (!password) {
      alert("Please fill out Password");
      return;
    }

    if (password.length !== 6) {
      alert("Password must be exactly 6 digits");
      return;
    }

    if (!role) {
      alert("Please select a role");
      return;
    }

    // ✅ Save role and userId, then navigate
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId || "unknown");
    if (role === "Student") navigate("/student");
    else if (role === "Driver") navigate("/driver");
    else if (role === "Admin") navigate("/admin");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">BIT Transport Portal</h1>
        <p className="subtitle">Safe • Smart • On Time</p>

        <form onSubmit={handleLogin}>
          <label>Email ID or Phone Number</label>
          <input
            type="text"
            placeholder="Enter Email or Mobile Number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="6-digit password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value.replace(/\D/g, ""))
            }
            maxLength="6"
          />

          <label>Login As</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Driver">Driver</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>

        <p className="footer">© 2026 Akshuu Transports</p>
      </div>
    </div>
  );
}

export default Login;
