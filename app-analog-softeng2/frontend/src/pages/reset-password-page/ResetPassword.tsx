import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";
import { motion } from "framer-motion";
import logo from "./logos/image 1.png";
import alogo from "./logos/gif 2.gif";

const pageVariants = {
  initial: { x: "-100vw", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100vw", opacity: 0 },
};

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage("Password reset successful!");
        navigate("/");
      } else {
        const errorData = await res.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="wrapper">
      <motion.div
        className="reset-password-container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: "tween", duration: 0.5 }}
      >
        <div className="reset-password-left">
          <img
            className="reset-password-video"
            style={{ width: 500 }}
            src={String(alogo)}
            alt="Reset Password Animation"
          />
        </div>
        <div className="reset-password-right">
          <div className="reset-password-header">
            <img
              className="logo"
              alt="Logo"
              style={{ width: 500 }}
              src={String(logo)}
            />
            <h2>Reset Password</h2>
            <p>Enter your new password below.</p>
          </div>
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Reset Password
            </button>
            {message && <p className="message">{message}</p>}
          </form>
          <button className="back-btn" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
