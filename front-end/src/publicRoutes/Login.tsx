// src/Login.tsx
import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const { login } = useContext(AuthContext) as {
    login: (data: unknown) => void; // adjust to your AuthContext type if you have one
  };

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/users/login", form);
      login(res.data); // if you have a specific type, use it here
      navigate("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Login to your Account</h2>
        <p>
          Enter your details to login your <strong>SneakUp Account</strong>.
        </p>

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