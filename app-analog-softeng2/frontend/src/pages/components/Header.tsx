import React, { useState } from "react";
import "./Header.css";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="maindiv">
      <div className="welcome-message">
        <p className="user-greeting">Welcome, user!</p>
      </div>

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

      <button className="button" id="notif-btn">
        <div className="icon-holder">
          <FaBell className="notif-icon" />
        </div>
      </button>

      <div className="profile-picture" />
      <div className="profile-texts">
        <p className="username-display">Sumting w.</p>
        <p className="user-position">Manager</p>
      </div>
    </div>
  );
}

export default Header;
