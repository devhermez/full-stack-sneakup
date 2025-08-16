import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api.js";
import { AuthContext } from "./context/AuthContext.jsx";
import { NavLink } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/users/login", form);
      login(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Login to your Account</h2>
        <p>Enter your details to login your <strong>SneakUp Account</strong>.</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="register-email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="register-password"
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="register-button">
            Login
          </button>
        </form>
        <p className="register-link">
          Don’t have an account? <NavLink to="/register">Register now</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
