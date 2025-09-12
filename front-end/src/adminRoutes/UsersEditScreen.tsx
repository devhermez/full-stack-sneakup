import { useEffect, useState, useContext} from "react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api";
import { AuthContext } from "../context/AuthContext";

import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";

import type { User as AuthUser } from "../types/User";

type RouteParams = { id: string };

const UsersEditScreen = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) as { user: (AuthUser & { token?: string }) | null };

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user?.token) {
      setError("Missing user id or auth token.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const { data } = await api.get<{ name: string; email: string; role: "user" | "admin" }>(
          `/api/users/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` }, signal: controller.signal }
        );
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching user", err);
          setError("Error fetching user.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, user?.token]);

  const handleUpdate = async () => {
    if (!id || !user?.token) return;
    try {
      await api.put(
        `/api/users/${id}`,
        { name, email, role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate("/admin/users");
    } catch (err: unknown) {
      console.error("Updating user failed.", err);
      setError("Updating user failed.");
    }
  };

  const handleDelete = async () => {
    if (!id || !user?.token) return;

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
    } catch (err: unknown) {
      console.error("Delete failed", err);
      setError("Delete failed.");
    }
  };

  if (loading) return <p>Loading user…</p>;
  if (error) return <p className="error-message">{error}</p>;

  const onInput =
    (setter: (v: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  return (
    <div className="admin-edit-container">
      <AdminNav />
      <div className="admin-edit-content">
        <h1 className="admin-edit-title">SneakUp Admin</h1>
        <h3 className="admin-edit-sub-title">User: {id}</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            className="form-group-input"
            value={name}
            onChange={onInput(setName)}
          />

          <label>Email</label>
          <input
            className="form-group-input"
            value={email}
            onChange={onInput(setEmail)}
          />

          <label>Role</label>
          <select
            className="form-group-input"
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
          >
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