
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { updateUserProfile, getUserProfile } from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    role: "student",
    phone: "+91 98765 43210",
    id: "BIT-2026-001",
    department: "Computer Science",
    year: "3rd Year"
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First try to load from local storage for immediate display
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(prev => ({ ...prev, ...JSON.parse(storedUser) }));
        }

        // Then fetch latest from server
        const profileData = await getUserProfile();
        // Merge server data with default structure to ensure all fields exist
        setUser(prev => ({
          ...prev,
          ...profileData,
          // Ensure ID from DB doesn't overwrite display ID if needed, or mapping
          id: profileData.studentId || profileData._id || prev.id
        }));

        // Update local storage with latest
        localStorage.setItem("user", JSON.stringify(profileData));
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      // Call backend API to update user
      const response = await updateUserProfile(user);

      // Update local state and storage with response to ensure sync
      const updatedUser = response.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      alert("Profile updated successfully!");

      // Optional: Trigger a window event
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const toggle2FA = async () => {
    const newState = !user.isTwoFactorEnabled;
    // Optimistic update
    setUser(prev => ({ ...prev, isTwoFactorEnabled: newState }));

    try {
      const response = await updateUserProfile({ ...user, isTwoFactorEnabled: newState });
      const updatedUser = response.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert(`Two-Factor Authentication is now ${newState ? 'ENABLED' : 'DISABLED'}`);
    } catch (err) {
      console.error("Failed to toggle 2FA:", err);
      setUser(prev => ({ ...prev, isTwoFactorEnabled: !newState })); // Revert on failure
      alert("Failed to update 2FA settings.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="profile-page-wrapper">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-cover"></div>
            <div className="profile-avatar-section">
              <div className="avatar-circle">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-title">
                <h1>{user.name}</h1>
                <span className="role-badge">{user.role.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="card-header">
                <h2>Personal Information</h2>
                <button
                  className={`edit-btn ${isEditing ? 'save' : ''}`}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="info-grid">
                <div className="info-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>

                <div className="info-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>

                <div className="info-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={user.phone}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </div>

                <div className="info-group">
                  <label>ID Number</label>
                  <input type="text" value={user.id || "N/A"} disabled />
                </div>

                <div className="info-group">
                  <label>Department</label>
                  <input type="text" value={user.department} disabled={!isEditing} />
                </div>

                <div className="info-group">
                  <label>Year / Designation</label>
                  <input type="text" value={user.year} disabled={!isEditing} />
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h2>Account Settings</h2>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Push Notifications</h4>
                  <p>Receive updates about bus location and attendance</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Email Alerts</h4>
                  <p>Receive daily route summaries via email</p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button
                  className={`secondary-btn ${user.isTwoFactorEnabled ? 'enabled' : ''}`}
                  onClick={toggle2FA}
                  style={{
                    background: user.isTwoFactorEnabled ? '#48bb78' : '#edf2f7',
                    color: user.isTwoFactorEnabled ? 'white' : '#2d3748'
                  }}
                >
                  {user.isTwoFactorEnabled ? "Enabled" : "Enable"}
                </button>
              </div>

              <div className="setting-item danger-zone">
                <button className="danger-btn">Delete Account</button>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .profile-page-wrapper {
            padding-top: 80px;
            min-height: 100vh;
            background-color: var(--background-color);
            display: flex;
            justify-content: center;
          }
          .profile-container {
            width: 100%;
            max-width: 1000px;
            padding: 20px;
          }
          .profile-header {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            margin-bottom: 2rem;
            position: relative;
          }
          .profile-cover {
            height: 150px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          }
          .profile-avatar-section {
            padding: 0 30px 30px;
            margin-top: -50px;
            display: flex;
            align-items: flex-end;
            gap: 20px;
          }
          .avatar-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: white;
            border: 4px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            font-weight: bold;
            color: var(--primary-color);
          }
          .profile-title h1 {
            margin: 0;
            color: var(--text-dark);
            font-size: 2rem;
          }
          .role-badge {
            display: inline-block;
            background: #e2e8f0;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: #4a5568;
            margin-top: 5px;
          }
          
          .profile-content {
            display: grid;
            gap: 2rem;
          }
          .profile-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
          }
          .edit-btn {
            background: transparent;
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
          }
          .edit-btn:hover {
            background: var(--primary-color-light);
          }
          .edit-btn.save {
            background: var(--primary-color);
            color: white;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
          }
          .info-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .info-group label {
            font-weight: 600;
            color: #718096;
            font-size: 0.9rem;
          }
          .info-group input {
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s;
          }
          .info-group input:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          }
          .info-group input:disabled {
            background: #f7fafc;
            color: #4a5568;
          }

          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .setting-item:last-child {
            border-bottom: none;
          }
          .setting-info h4 {
            margin: 0 0 5px 0;
            color: var(--text-dark);
          }
          .setting-info p {
            margin: 0;
            color: #a0aec0;
            font-size: 0.9rem;
          }

          /* Toggle Switch */
          .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 28px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
          }
          input:checked + .slider {
            background-color: var(--primary-color);
          }
          input:checked + .slider:before {
            transform: translateX(22px);
          }
          .slider.round {
            border-radius: 34px;
          }
          .slider.round:before {
            border-radius: 50%;
          }

          .secondary-btn {
            background: #edf2f7;
            color: #2d3748;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          }
          .danger-btn {
            background: #fff5f5;
            color: #c53030;
            border: 1px solid #c53030;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          }
          .danger-btn:hover {
            background: #c53030;
            color: white;
          }

          @media (max-width: 600px) {
            .profile-avatar-section {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .avatar-circle {
              margin-bottom: 10px;
            }
            .card-header {
              flex-direction: column;
              gap: 15px;
            }
            .edit-btn {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
}
