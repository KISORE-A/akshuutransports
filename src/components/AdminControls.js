import React, { useState, useEffect } from "react";
import { getAllUsers, registerUser, getBuses, addBus, deleteBus } from "../services/api";

export default function AdminControls() {
  const [activeTab, setActiveTab] = useState("students");
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchBuses();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await getBuses();
      setBuses(data);
    } catch (err) {
      console.error("Failed to fetch buses", err);
    }
  };

  const students = users.filter(u => u.role === 'student');
  const drivers = users.filter(u => u.role === 'driver');

  // Bus Management (API)
  const handleAddBus = async () => {
    const busNo = prompt("Enter Bus Number (e.g., TN-23-AB-1234):");
    if (!busNo) return;
    const type = prompt("Enter Bus Type:") || "Transport";

    const newBus = {
      busNo,
      type,
      status: "Running",
      capacity: 40
    };

    try {
      await addBus(newBus);
      alert("Bus added successfully!");
      fetchBuses();
    } catch (err) {
      alert("Failed to add bus: " + err.message);
    }
  };

  const handleDeleteBus = async (id) => {
    if (window.confirm("Delete this bus?")) {
      try {
        await deleteBus(id);
        fetchBuses();
      } catch (err) {
        alert("Failed to delete bus: " + err.message);
      }
    }
  };

  // User Management (API)
  const handleAddUser = async (role) => {
    const name = prompt(`Enter ${role} Name:`);
    if (!name) return;
    const email = prompt(`Enter ${role} Email:`);
    if (!email) return;
    const password = prompt("Enter Password (default: 123456):") || "123456";

    try {
      await registerUser(name, email, password, role);
      alert(`${role} added successfully!`);
      fetchUsers();
    } catch (err) {
      alert("Error adding user: " + err.message);
    }
  };

  const getTabs = () => [
    { id: "students", label: "🎓 Students", count: students.length },
    { id: "drivers", label: "👨‍✈️ Drivers", count: drivers.length },
    { id: "buses", label: "🚌 Buses", count: buses.length },
  ];

  return (
    <div className="card admin-card">
      <h3>⚙️ Admin Management</h3>

      <div className="admin-tabs">
        {getTabs().map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="admin-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === "buses" && (
        <div className="admin-section">
          <button onClick={handleAddBus} className="success" style={{ width: "100%", marginBottom: "12px" }}>
            ➕ Add Bus
          </button>
          <div className="admin-list">
            {buses.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-light)" }}>No buses yet</p>
            ) : (
              buses.map((bus) => (
                <div key={bus._id} className="admin-item">
                  <div className="admin-item-info">
                    <strong>{bus.busNo}</strong>
                    <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0 0" }}>{bus.type}</p>
                  </div>
                  <div className="admin-item-actions">
                    <span className="badge success">{bus.status}</span>
                    <button onClick={() => handleDeleteBus(bus._id)} className="danger" style={{ padding: "4px 8px", fontSize: "12px" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "drivers" && (
        <div className="admin-section">
          <button onClick={() => handleAddUser('driver')} className="success" style={{ width: "100%", marginBottom: "12px" }}>
            ➕ Add Driver
          </button>
          <div className="admin-list">
            {drivers.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-light)" }}>No drivers found</p>
            ) : (
              drivers.map((driver) => (
                <div key={driver.id} className="admin-item">
                  <div className="admin-item-info">
                    <strong>{driver.name}</strong>
                    <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0 0" }}>{driver.email}</p>
                  </div>
                  <div className="admin-item-actions">
                    <span className="badge info">Driver</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div className="admin-section">
          <button onClick={() => handleAddUser('student')} className="success" style={{ width: "100%", marginBottom: "12px" }}>
            ➕ Add Student
          </button>
          <div className="admin-list">
            {students.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-light)" }}>No students found</p>
            ) : (
              students.map((student) => (
                <div key={student.id} className="admin-item">
                  <div className="admin-item-info">
                    <strong>{student.name}</strong>
                    <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0 0" }}>{student.email}</p>
                  </div>
                  <div className="admin-item-actions">
                    <span className="badge info">Student</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
