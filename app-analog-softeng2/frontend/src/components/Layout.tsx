import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Loader from "./Loader";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ["/", "/register"];
  const [isExpanded, setIsExpanded] = useState(true); // Navbar state
  const [loading, setLoading] = useState(false);

  const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500); // Adjust the timeout duration as needed
    };

    handleRouteChange();
  }, [location.pathname]);

  return (
    <div
      className={`layout ${
        isNoNavbarRoute ? "" : isExpanded ? "expanded" : "collapsed"
      }`}
    >
      {loading && <Loader />}
      {!isNoNavbarRoute && (
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      )}
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;