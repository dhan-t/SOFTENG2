import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { motion } from "framer-motion";
import logo from "./logos/image 1.png";
import alogo from "./logos/gif 2.gif";

const pageVariants = {
  initial: { x: "-100vw", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100vw", opacity: 0 },
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        const errorData = await res.json();
        setMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="wrapper">
      <motion.div
        className="forgot-password-container"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: "tween", duration: 0.5 }}
      >
        <div className="forgot-password-left">
          <img
            className="forgot-password-video"
            style={{ width: 500 }}
            src={String(alogo)}
            alt="Forgot Password Animation"
          />
        </div>
        <div className="forgot-password-right">
          <div className="forgot-password-header">
            <img
              className="logo"
              alt="Logo"
              style={{ width: 500 }}
              src={String(logo)}
            />
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>
          </div>
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Send Reset Link
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

export default ForgotPassword;
