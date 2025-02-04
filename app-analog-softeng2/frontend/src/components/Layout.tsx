import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ["/", "/register", "/login"];
  const [isExpanded, setIsExpanded] = useState(true); // Navbar state

  const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname);

  return (
    <div
      className={`layout ${
        !isNoNavbarRoute && isExpanded
          ? "expanded"
          : !isNoNavbarRoute
          ? "collapsed"
          : ""
      }`}
    >
      {!isNoNavbarRoute && (
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      )}
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
