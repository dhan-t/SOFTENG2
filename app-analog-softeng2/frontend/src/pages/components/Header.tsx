import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Notification {
  message: string;
  createdAt: string;
}

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    profilePicture: "",
  });
  const popupRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNotifClick = () => {
    if (showNotifications) {
      setIsHiding(true);
      setTimeout(() => {
        setShowNotifications(false);
        setIsHiding(false);
      }, 300); // Match the duration of the slide-out animation
    } else {
      setShowNotifications(true);
    }
  };

  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleSeeAll = () => {
    // Redirect to the notifications page
    navigate("/notifications");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setIsHiding(true);
      setTimeout(() => {
        setShowNotifications(false);
        setShowProfilePopup(false);
        setIsHiding(false);
      }, 300); // Match the duration of the slide-out animation
    }
  };

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

    // Fetch user profile from the backend
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5001/api/user/${user}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched profile:", data);
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();

    // Add event listener to detect clicks outside the popup
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  return (
    <div className="maindiv">
      <div className="welcome-message">
        <p className="user-greeting">Welcome, {profile.firstName || "user"}!</p>
      </div>
      <div className="header">
          <div className="search-bar">
          <input
            className="input-field"
            type="text"
            placeholder="Search product, supplier, order"
            value={searchTerm}
            onChange={handleChange}
           />

          <button className="button" id="search-btn">
            <div className="icon-holder">
              <FaMagnifyingGlass className="search-icon" />
            </div>
          </button>
        </div>
      

      <button className="search button" id="notif-btn" onClick={handleNotifClick}>
        <div className="icon-holder">
          <FaBell className="notif-icon" />
        </div>
      </button>

      {(showNotifications || isHiding) && (
        <div className={`notification-popup ${isHiding ? 'hide' : ''}`} ref={popupRef}>
          <div className="notification-header">
            <h3>Notifications</h3>
            <span className="see-all" onClick={handleSeeAll}>
              See All
            </span>
          </div>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                {notification.message}
              </li>
            ))}
          </ul>
          <div className="clear-all" onClick={handleClearAll}>
            Clear All
          </div>
        </div>
      )}

      <div className="profile-section" ref={profileRef}>
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="profile-picture"
            onClick={handleProfileClick}
          />
        ) : (
          <div className="profile-picture" onClick={handleProfileClick} />
        )}
        <div className="profile-texts">
          <p className="username-display">{profile.firstName}</p>
          
        </div>
        {showProfilePopup && (
          <div className="profile-popup">
            <ul>
              <li onClick={() => navigate("/profile")}>Edit Profile</li>
              <li onClick={() => navigate("/settings")}>Settings</li>
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Header;