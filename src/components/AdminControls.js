import React from "react";
import { Link } from "react-router-dom";
import "./AdminControls.css";

export default function AdminControls() {
  return (
    <div className="card admin-card">
      <h3 className="quick-title">Quick Actions</h3>
      <p className="quick-sub">
        Tap a card to open the correct admin page. Use these to register users or add vehicles.
      </p>

      <div className="quick-grid">
        <Link to="/admin/students/add" className="quick-card quick-student">
          <div className="quick-icon">🎓</div>
          <div className="quick-name">Register New Student</div>
          <div className="quick-desc">Add a student to the transport system with bus assignment</div>
        </Link>

        <Link to="/admin/teachers/add" className="quick-card quick-teacher">
          <div className="quick-icon">📘</div>
          <div className="quick-name">Register New Teacher</div>
          <div className="quick-desc">Create staff account with department assignment</div>
        </Link>

        <Link to="/admin/drivers/add" className="quick-card quick-driver">
          <div className="quick-icon">🛞</div>
          <div className="quick-name">Register New Driver</div>
          <div className="quick-desc">Onboard driver with license and bus assignment</div>
        </Link>

        <Link to="/admin/buses/add" className="quick-card quick-bus">
          <div className="quick-icon">🚌</div>
          <div className="quick-name">Add New Vehicle</div>
          <div className="quick-desc">Register bus with insurance, capacity, and driver</div>
        </Link>

        <Link to="/admin/finance" className="quick-card quick-fee">
          <div className="quick-icon">💳</div>
          <div className="quick-name">Fee Management</div>
          <div className="quick-desc">Edit fees and send reminders via WhatsApp or Email</div>
        </Link>

        <Link to="/admin/students" className="quick-card quick-attendance">
          <div className="quick-icon">🎯</div>
          <div className="quick-name">Individual Attendance</div>
          <div className="quick-desc">Search and manage attendance for any user</div>
        </Link>
      </div>
    </div>
  );
}
