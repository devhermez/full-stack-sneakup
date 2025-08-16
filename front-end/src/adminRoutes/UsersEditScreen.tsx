import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminNav from './AdminNav.jsx'
import AdminFooter from './AdminFooter.jsx'

const UsersEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };
    fetchUser();
  }, [id, user.token]);

  const handleUpdate = async () => {
    try {
      await api.put(
        `/api/users/${id}`,
        { name, email, role },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      navigate("/admin/users");
    } catch (err) {
      console.error("Updating user failed.", err);
    }
  };

  const handleDelete = async () => {
    if (user._id === id) {
      alert("You can't delete your own account.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/admin/users");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="admin-edit-container">
      <AdminNav />
      <div className="admin-edit-content">
        <h1 className="admin-edit-title">SneakUp Admin</h1>
        <h3 className="admin-edit-sub-title">User: {id}</h3>
        <div className="form-group">
          <label>Name</label>
          <input className='form-group-input'value={name} onChange={(e) => setName(e.target.value)} />
          <label>Email</label>
          <input className='form-group-input' value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Role</label>
          <select className='form-group-input' value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <div className="admin-edit-buttons">
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete User</button>
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default UsersEditScreen;
