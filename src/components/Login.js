import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // Role selection
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      const userRole = data.user.role;

      if (userRole !== selectedRole) {
        setError(`Access Denied: You are not authorized as a ${selectedRole.toUpperCase()}. Please select the correct role.`);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (userRole === "student") navigate("/student");
      else if (userRole === "driver") navigate("/driver");
      else if (userRole === "admin") navigate("/admin");
      else if (userRole === "teacher") navigate("/teacher");
      else setError("Unknown role");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">
        <h1 className="title">Akshuu Transports</h1>
        <p className="subtitle">Safe • Smart • On Time</p>

        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}

          {!selectedRole ? (
            <div className="form-group role-select-group">
              <label>Select Your Login Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
                className="role-select"
              >
                <option value="" disabled>-- Choose your role --</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ) : (
            <div className="selected-role-header">
              <p>Logging in as <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{selectedRole}</span></p>
              <button
                type="button"
                onClick={() => { setSelectedRole(""); setEmail(""); setPassword(""); }}
                className="change-role-btn"
              >
                Change Role
              </button>
            </div>
          )}

          <div className={`login-fields ${selectedRole ? 'visible' : ''}`}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!!selectedRole}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!!selectedRole}
            />

            <button type="submit" disabled={loading || !selectedRole}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {selectedRole && (
          <p className="footer">
            Default Creds: {selectedRole}@bit.edu <br />
            Pass: 123456
          </p>
        )}
        <p className="footer">
          <Link to="/terms-privacy" style={{ color: '#666', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer' }}>Terms & Privacy Policy</Link>
        </p>
        <p className="footer">© 2026 Akshuu Transports</p>

      </div>
    </div>
  );
}

export default Login;
