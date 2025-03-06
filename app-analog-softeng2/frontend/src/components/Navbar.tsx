import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./logos/image 1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StickyNote2RoundedIcon from "@mui/icons-material/StickyNote2Rounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import FindReplaceRoundedIcon from "@mui/icons-material/FindReplaceRounded";
import LibraryAddCheckRoundedIcon from "@mui/icons-material/LibraryAddCheckRounded";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

interface NavbarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [activeItem, setActiveItem] = useState(location.pathname); // Track active item
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    // Fetch user profile from the backend
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:5001/api/user/${user}`
          );
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
  }, [user]);

  const handleItemClick = (path: string) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
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
          icon={<HomeRoundedIcon />}
          active={activeItem === "/dashboard"}
          onClick={handleItemClick}
        />
        <NavbarItem
          text="Generate workorder"
          link="/workorder"
          isExpanded={isExpanded}
          icon={<StickyNote2RoundedIcon />}
          active={activeItem === "/workorder"}
          onClick={handleItemClick}
        />
        <NavbarItem
          text="Track requests"
          link="/trackrequest"
          isExpanded={isExpanded}
          icon={<InventoryRoundedIcon />}
          active={activeItem === "/trackrequest"}
          onClick={handleItemClick}
        />
        <NavbarItem
          text="Request modules"
          link="/requestmodule"
          isExpanded={isExpanded}
          icon={<FindReplaceRoundedIcon />}
          active={activeItem === "/requestmodule"}
          onClick={handleItemClick}
        />
        <NavbarItem
          text="Report production"
          link="/production"
          isExpanded={isExpanded}
          icon={<LibraryAddCheckRoundedIcon />}
          active={activeItem === "/production"}
          onClick={handleItemClick}
        />
      </ul>

      <div className="navbar-bottom">
        <div className="user-info">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="User Avatar"
              className="user-avatar"
            />
          ) : (
            <img
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User Avatar"
              className="user-avatar"
            />
          )}
          {isExpanded && (
            <div className="user-details">
              <h4>{`${profile.firstName} ${profile.lastName}`}</h4>
              <span>{profile.email}</span>
            </div>
          )}
        </div>

        <div className="separator"></div>

        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
};

interface NavbarItemProps {
  text: string;
  link: string;
  isExpanded: boolean;
  icon: React.ReactNode;
  active: boolean;
  onClick: (path: string) => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  text,
  link,
  isExpanded,
  icon,
  active,
  onClick,
}) => {
  return (
    <li
      className={`nav-item ${active ? "active" : ""}`}
      onClick={() => onClick(link)}
    >
      <Link to={link} className="nav-link">
        <span className="nav-icon">{icon}</span>
        {isExpanded && <span className="nav-text">{text}</span>}
      </Link>
    </li>
  );
};

export default Navbar;