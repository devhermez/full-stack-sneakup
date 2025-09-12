import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import api from "../api";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";

import type { User } from "../types/User";

const UsersListScreen = () => {
  const { user } = useContext(AuthContext) as { user: { token: string } | null };
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    document.title = "Admin | Users";
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const fetchUsers = async () => {
      try {
        const { data } = await api.get<User[]>("/api/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, [user?.token]);

  return (
    <div className="admin-products-container">
      <AdminNav />
      <div className="admin-products-content">
        <h1 className="admin-gen-title">SneakUp Admin</h1>
        <h3 className="admin-gen-sub-title">All Users</h3>
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="user-email">Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td className="user-email">{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <Link to={`/admin/users/${u._id}`}>
                    <button>Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminFooter />
    </div>
  );
};

export default UsersListScreen;