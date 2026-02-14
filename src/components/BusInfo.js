import React, { useEffect, useState } from "react";

const defaultBus = {
  busNo: "TN-23-AB-1234",
  type: "College Transport",
  status: "Running",
};

export default function BusInfo() {
  const [bus, setBus] = useState(defaultBus);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const role = localStorage.getItem("role");
  const canEdit = role === "Driver" || role === "Admin";

  useEffect(() => {
    const saved = localStorage.getItem("busInfo");
    if (saved) {
      setBus(JSON.parse(saved));
    }
  }, []);

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleStartEdit = () => {
    setEditForm({ ...bus });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setBus(editForm);
    localStorage.setItem("busInfo", JSON.stringify(editForm));
    setIsEditing(false);
  };

  return (
    <div className="card">
      <h3>🚌 Bus Information</h3>
      {isEditing ? (
        <div className="edit-box">
          <h4>✏️ Edit Bus</h4>
          <div className="form-group">
            <label>Bus No</label>
            <input
              type="text"
              value={editForm.busNo || ""}
              onChange={(e) => handleEditChange("busNo", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Bus Type</label>
            <input
              type="text"
              value={editForm.type || ""}
              onChange={(e) => handleEditChange("type", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={editForm.status || ""}
              onChange={(e) => handleEditChange("status", e.target.value)}
            >
              <option value="Running">Running</option>
              <option value="Stopped">Stopped</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              onClick={handleSaveEdit}
              className="success"
            >
              ✓ Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="secondary"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>
            <strong>Bus No:</strong> {bus.busNo}
          </p>
          <p>
            <strong>Bus Type:</strong> {bus.type}
          </p>
          <p>
            <strong>Status:</strong> {bus.status}
          </p>
          {canEdit && (
            <button
              onClick={handleStartEdit}
              style={{ width: "100%", marginTop: "8px" }}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
