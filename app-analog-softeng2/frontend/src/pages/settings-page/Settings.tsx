import React, { useState, useEffect } from "react";
import "./Settings.css";
import { useAuth } from "../../hooks/useAuth";

const Settings: React.FC = () => {
  const { token } = useAuth();
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [autoLogout, setAutoLogout] = useState<boolean>(false);

  useEffect(() => {
    // Fetch settings from the backend or local storage
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPushNotifications(data.pushNotifications);
        setDarkMode(data.darkMode);
        setEmailNotifications(data.emailNotifications);
        setAutoLogout(data.autoLogout);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [token]);

  useEffect(() => {
    // Apply dark mode class to the root element
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pushNotifications,
          darkMode,
          emailNotifications,
          autoLogout,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="setting-item">
        <label>Push Notifications</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="setting-item">
        <label>Dark Mode</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="setting-item">
        <label>Email Notifications</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div className="setting-item">
        <label>Auto-Logout</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={autoLogout}
            onChange={() => setAutoLogout(!autoLogout)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <button className="save-btn" onClick={handleSaveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
