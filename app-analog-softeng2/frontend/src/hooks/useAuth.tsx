import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (email: string, password: string, remember: boolean) => Promise<string | null>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Persist the logged-in user and token in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = Cookies.get("token");

    if (savedUser && savedToken) {
      setUser(savedUser); // Set user from localStorage if token is present
      setToken(savedToken); // Set token from cookies
    }
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, remember }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(email);
        setToken(data.token);
        localStorage.setItem("user", email); // Store logged-in user in localStorage
        Cookies.set("token", data.token, { expires: remember ? 30 : 1 }); // Store JWT token in a cookie
        return null;
      } else {
        const errorData = await res.json();
        return errorData.error;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return "An error occurred during login. Please try again.";
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        return true;
      } else {
        console.error("Registration failed");
        return false;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user"); // Remove user from localStorage on logout
    Cookies.remove("token"); // Remove JWT token from cookies
  };

  const refreshUser = () => {
    const savedUser = localStorage.getItem("user");
    const savedToken = Cookies.get("token");
    if (savedUser && savedToken) {
      setUser(savedUser); // Refresh user from localStorage
      setToken(savedToken); // Refresh token from cookies
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};