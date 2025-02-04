import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./logos/image 1.png";
import alogo from "./logos/gif 2.gif";

const pageVariants = {
  initial: { x: "-100vw", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100vw", opacity: 0 },
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = await login(email, password);

    if (error) {
      setErrorMessage(error);
    } else {
      alert("Login successful!");
      navigate("/dashboard");
    }
  };

  return (
    <motion.div
      className="login-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "tween", duration: 0.5 }}
    >
      <div className="login-left">
        <img className="login-video" style={{ width: 500 }} src={String(alogo)} alt="Login Animation" />
      </div>
      <div className="login-right">
        <div className="login-header">
          <img className="logo" alt="Logo" style={{ width: 500 }} src={String(logo)} />
          <h2>Log in to your account</h2>
          <p>Welcome back! Please enter your details.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
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
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" style={{ marginRight: '8px' }}/>
              <label htmlFor="remember">Remember for 30 days</label>
            </div>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>
          <button type="submit" className="submit-btn">
            Log in
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <div className="register">
          <p>Don’t have an account?</p>
          <button className="register-btn" onClick={() => navigate("/register")}>
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
