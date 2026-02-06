import React, { useEffect, useState } from "react";

function lastNDates(n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export default function AttendanceSummary({ forUser }) {
  const [attendance, setAttendance] = useState({});
  const [selected, setSelected] = useState(forUser || "");
  const [newDate, setNewDate] = useState("");
  const windowDays = 30;

  useEffect(() => {
    const raw = localStorage.getItem("attendance");
    const parsed = raw ? JSON.parse(raw) : {};
    setAttendance(parsed);
    if (!forUser) {
      const uid = localStorage.getItem("userId");
      if (uid) setSelected(uid);
    }
  }, [forUser]);

  // Save to localStorage
  const saveAttendance = (updated) => {
    setAttendance(updated);
    localStorage.setItem("attendance", JSON.stringify(updated));
  };

  const keys = Object.keys(attendance).sort();
  const viewUser = selected || (keys[0] || "");
  const role = localStorage.getItem("role");
  const isDriver = role === "Driver";
  const isAdmin = role === "Admin";

  // compute present in window
  const windowDates = lastNDates(windowDays);
  const presentDates = (attendance[viewUser] || []).filter((d) =>
    windowDates.includes(d)
  );
  const presentCount = presentDates.length;
  const absentCount = windowDays - presentCount;

  // Add date
  const handleAddDate = () => {
    if (!newDate) {
      alert("Please select a date");
      return;
    }
    if (!viewUser) {
      alert("Please select a student");
      return;
    }

    const updated = { ...attendance };
    updated[viewUser] = updated[viewUser] || [];
    if (!updated[viewUser].includes(newDate)) {
      updated[viewUser].push(newDate);
      updated[viewUser].sort();
      saveAttendance(updated);
      setNewDate("");
    } else {
      alert("Date already marked as present");
    }
  };

  // Remove date
  const handleRemoveDate = (date) => {
    const updated = { ...attendance };
    updated[viewUser] = (updated[viewUser] || []).filter((d) => d !== date);
    saveAttendance(updated);
  };

  // Only driver and admin can edit
  const canEdit = isDriver || isAdmin;

  return (
    <div className="card">
      <h3>📊 Attendance Summary</h3>

      {!forUser && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            Select Student
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">-- select --</option>
            {keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      )}

      {viewUser ? (
        <div>
          <p>
            <strong>Student:</strong> {viewUser}
          </p>
          <p>
            <strong>Present (last {windowDays} days):</strong> {presentCount}
          </p>
          <p>
            <strong>Absent (last {windowDays} days):</strong> {absentCount}
          </p>

          {canEdit && (
            <div
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "6px",
                marginTop: "12px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h4>✏️ Edit Attendance</h4>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ flex: 1, padding: "6px" }}
                />
                <button
                  onClick={handleAddDate}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#5cb85c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Mark Present
                </button>
              </div>
            </div>
          )}

          <details style={{ marginTop: "12px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              Present Dates ({(attendance[viewUser] || []).length})
            </summary>
            <div
              style={{
                marginTop: "8px",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "#f5f5f5",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              {(attendance[viewUser] || []).length === 0 ? (
                <p style={{ color: "#999" }}>No attendance records</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {(attendance[viewUser] || []).map((d) => (
                    <li
                      key={d}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 0",
                      }}
                    >
                      <span>{d}</span>
                      {canEdit && (
                        <button
                          onClick={() => handleRemoveDate(d)}
                          style={{
                            padding: "2px 8px",
                            backgroundColor: "#d9534f",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        </div>
      ) : (
        <p>No student selected and no attendance data available.</p>
      )}
    </div>
  );
}
