import React, { useEffect, useState } from "react";

const defaultRoute = {
  route: "City → College",
  startTime: "08:30",
  eta: "09:10",
};

export default function RouteInfo() {
  const [routeData, setRouteData] = useState(defaultRoute);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const role = localStorage.getItem("role");
  const canEdit = role === "Driver" || role === "Admin";

  useEffect(() => {
    const saved = localStorage.getItem("routeInfo");
    if (saved) {
      setRouteData(JSON.parse(saved));
    }
  }, []);

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleStartEdit = () => {
    setEditForm({ ...routeData });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setRouteData(editForm);
    localStorage.setItem("routeInfo", JSON.stringify(editForm));
    setIsEditing(false);
  };

  return (
    <div className="card">
      <h3>🛣️ Route & Timing</h3>
      {isEditing ? (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h4>✏️ Edit Route</h4>
          <div style={{ marginBottom: "8px" }}>
            <label>Route</label>
            <input
              type="text"
              value={editForm.route || ""}
              onChange={(e) => handleEditChange("route", e.target.value)}
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
              placeholder="e.g., City → College"
            />
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label>Start Time</label>
            <input
              type="time"
              value={editForm.startTime || ""}
              onChange={(e) => handleEditChange("startTime", e.target.value)}
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label>ETA (Estimated Time of Arrival)</label>
            <input
              type="time"
              value={editForm.eta || ""}
              onChange={(e) => handleEditChange("eta", e.target.value)}
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
            <strong>Route:</strong> {routeData.route}
          </p>
          <p>
            <strong>Start Time:</strong> {routeData.startTime}
          </p>
          <p>
            <strong>ETA:</strong> {routeData.eta}
          </p>
          {canEdit && (
            <button
              onClick={handleStartEdit}
              style={{
                width: "100%",
                marginTop: "8px",
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
          )}
        </div>
      )}
    </div>
  );
}
