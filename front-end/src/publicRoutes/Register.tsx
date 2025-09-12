import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type FormState = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value } as FormState));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/users/register", form);
      console.log("Registration Success", res.data);
      navigate("/login");
    } catch (err) {
      const message = (err as any)?.response?.data?.message || "Registration failed.";
      setError(message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Sign Up for Registration</h2>
        <p>
          Enter your details to create a <strong>SneakUp Account</strong> using
          the form below.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="register-name"
            required
          />
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
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;