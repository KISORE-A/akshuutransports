import React, { useEffect, useState } from "react";

const defaultDrivers = [
  { id: 1, name: "Ravi Kumar", phone: "9876543210", experience: 8, busNo: "TN-23-AB-1234" },
  { id: 2, name: "Vikram Singh", phone: "9876543211", experience: 5, busNo: "TN-23-AB-5678" },
  { id: 3, name: "Arjun Patel", phone: "9876543212", experience: 10, busNo: "TN-23-AB-9012" },
];

export default function DriverInfo() {
  const [drivers, setDrivers] = useState(defaultDrivers);
  const [selectedId, setSelectedId] = useState(defaultDrivers[0]?.id || 1);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";

  useEffect(() => {
    const saved = localStorage.getItem("drivers");
    if (saved) {
      setDrivers(JSON.parse(saved));
    }
  }, []);

  const currentDriver = drivers.find((d) => d.id === selectedId) || drivers[0];

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: field === "id" || field === "experience" ? parseInt(value) : value });
  };

  const handleStartEdit = () => {
    setEditForm({ ...currentDriver });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updated = drivers.map((d) =>
      d.id === editForm.id ? editForm : d
    );
    setDrivers(updated);
    localStorage.setItem("drivers", JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleAddDriver = () => {
    const newId = Math.max(...drivers.map(d => d.id)) + 1;
    const newDriver = {
      id: newId,
      name: "New Driver",
      phone: "0000000000",
      experience: 0,
      busNo: "TN-00-XX-0000",
    };
    const updated = [...drivers, newDriver];
    setDrivers(updated);
    localStorage.setItem("drivers", JSON.stringify(updated));
    setSelectedId(newId);
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm("Delete this driver?")) {
      const updated = drivers.filter((d) => d.id !== id);
      setDrivers(updated);
      localStorage.setItem("drivers", JSON.stringify(updated));
      if (selectedId === id) {
        setSelectedId(updated[0]?.id || 1);
      }
    }
  };

  return (
    <div className="card">
      <h3>👨‍✈️ Driver Details</h3>

      {isAdmin && (
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
            Select Driver
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(parseInt(e.target.value));
                setIsEditing(false);
              }}
              style={{ flex: 1, padding: "8px" }}
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.phone})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddDriver}
              style={{
                padding: "8px 12px",
                backgroundColor: "#5cb85c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ➕ Add
            </button>
          </div>
        </div>
      )}

      {currentDriver ? (
        isEditing ? (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h4>✏️ Edit Driver</h4>
            <div style={{ marginBottom: "8px" }}>
              <label>Name</label>
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) => handleEditChange("name", e.target.value)}
                style={{ width: "100%", padding: "6px", marginTop: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label>Phone</label>
              <input
                type="text"
                value={editForm.phone || ""}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                style={{ width: "100%", padding: "6px", marginTop: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label>Experience (Years)</label>
              <input
                type="number"
                value={editForm.experience || 0}
                onChange={(e) => handleEditChange("experience", e.target.value)}
                style={{ width: "100%", padding: "6px", marginTop: "4px" }}
              />
            </div>
            <div style={{ marginBottom: "12px" }}>
              <label>Bus No</label>
              <input
                type="text"
                value={editForm.busNo || ""}
                onChange={(e) => handleEditChange("busNo", e.target.value)}
                style={{ width: "100%", padding: "6px", marginTop: "4px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#5cb85c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#999",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {currentDriver.name}
            </p>
            <p>
              <strong>Phone:</strong> {currentDriver.phone}
            </p>
            <p>
              <strong>Experience:</strong> {currentDriver.experience} Years
            </p>
            <p>
              <strong>Bus No:</strong> {currentDriver.busNo}
            </p>
            {isAdmin && (
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button
                  onClick={handleStartEdit}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#0275d8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteDriver(currentDriver.id)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#d9534f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <p>No driver data available</p>
      )}
    </div>
  );
}
