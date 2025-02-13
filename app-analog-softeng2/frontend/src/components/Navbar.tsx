import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logos/image 1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

interface NavbarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="navbar-top">
        <div
          className="logo-container"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img
            src={String(logo)}
            alt="Logo"
            style={{ width: isExpanded ? 120 : 40 }} // Dynamically change logo size
          />
        </div>
      </div>

      <ul className="nav-links">
        <NavbarItem
          text="Dashboard"
          link="/dashboard"
          isExpanded={isExpanded}
          icon="📊"
        />
        <NavbarItem
          text="Generate workorder"
          link="/workorder"
          isExpanded={isExpanded}
          icon="📋"
        />
        <NavbarItem
          text="Track requests"
          link="/trackrequest"
          isExpanded={isExpanded}
          icon="🔎"
        />
        <NavbarItem
          text="Request modules"
          link="/requestmodule"
          isExpanded={isExpanded}
          icon="📦"
        />
        <NavbarItem
          text="Report production"
          link="/reportproduction"
          isExpanded={isExpanded}
          icon="✅"
        />
      </ul>

      <div className="navbar-bottom">
        <div className="user-info">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User Avatar"
            className="user-avatar"
          />
          {isExpanded && (
            <div className="user-details">
              <h4>John Doe</h4>
              <span>johndoe@gmail.com</span>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          {isExpanded ? "Logout" : <FontAwesomeIcon icon={faSignOutAlt} />}
        </button>
      </div>
    </nav>
  );
};

interface NavbarItemProps {
  text: string;
  link: string;
  isExpanded: boolean;
  icon: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  text,
  link,
  isExpanded,
  icon,
}) => {
  return (
    <li className="nav-item">
      <Link to={link} className="nav-link">
        <span className="nav-icon">{icon}</span>
        {isExpanded && <span className="nav-text">{text}</span>}
      </Link>
    </li>
  );
};

export default Navbar;
