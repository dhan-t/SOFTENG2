import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "./logos/image 1.png";
import alogo from "./logos/gif 2.gif";

const pageVariants = {
  initial: { x: "100vw", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100vw", opacity: 0 },
};

const Register: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(email, password);

    if (success) {
      alert("Registration successful! You can now log in.");
      navigate("/");
    } else {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <motion.div
      className="register-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "tween", duration: 0.5 }}
    >
      <div className="register-left">
        <img className="login-video" style={{ width: 500 }} src={String(alogo)} alt="Login Animation" />
      </div>
      <div className="register-right">
        <div className="register-header">
          <img className="logo" alt="Logo" style={{ width: 500 }} src={String(logo)} />
          <h2>Create an account</h2>
          <p>Join us and start working!</p>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
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
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Sign up
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <div className="login">
          <p>Already have an account?</p>
          <button className="login-btn" onClick={() => navigate("/")}>
            Log in
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
