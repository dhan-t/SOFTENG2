import React, { useState, useEffect } from "react";
import "./Notification.css";

interface Notification {
  message: string;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/notifications");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-page">
      <h1>Notifications</h1>
      <ul className="notification-list">
        {notifications.map((notification, index) => (
          <li key={index} className="notification-item">
            <p>{notification.message}</p>
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
