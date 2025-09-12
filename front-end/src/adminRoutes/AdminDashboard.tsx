import { useEffect, useState, useContext } from "react";
import api from "../api";
import type { Product } from "../types/Product";
import type { Order } from "../types/Order";
import type { User } from "../types/User";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";
import { AuthContext } from "../context/AuthContext";
import type { User as AuthUser } from "../types/User";
import { NavLink } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const { user } = useContext(AuthContext) as {
    user: (AuthUser & { token?: string }) | null;
  };

  useEffect(() => {
    let cancelled = false;

    const headers = user?.token
      ? { Authorization: `Bearer ${user.token}` }
      : undefined;

    const run = async () => {
      setLoading(true);
      setErr("");

      try {
        const [prodRes, ordersRes, usersRes] = await Promise.all([
          api.get<Product[]>("/api/products"),
          api.get<Order[]>("/api/orders", { headers }),
          api.get<User[]>("/api/users", { headers }),
        ]);

        if (cancelled) return;

        setProducts(prodRes.data.slice(0, 3));
        setOrders(ordersRes.data.slice(0, 3));
        setUsers(usersRes.data.slice(0, 3));
      } catch (e) {
        if (!cancelled) setErr("Failed to load dashboard data.");
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [user?.token]);

  return (
    <div className="admin-dashboard">
      <AdminNav />
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-information">
          <h1 className="admin-gen-title">SneakUp Admin</h1>
          <p>
            Welcome <strong>{user?.name ?? "Admin"}!</strong>
          </p>
        </div>

        {loading && <p>Loading…</p>}
        {err && <p className="error-message">{err}</p>}

        {!loading && !err && (
          <>
            <section>
              <h2>Recent Products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p._id}>
                    {p.name} — ${Number(p.price).toFixed(2)}
                  </li>
                ))}
              </ul>
              <NavLink to="/admin/products" className="admin-dashboard-button">
                VIEW PRODUCTS
              </NavLink>
            </section>

            <section>
              <h2>Recent Orders</h2>
              <ul>
                {orders.map((o) => (
                  <li key={o._id}>{o._id}</li>
                ))}
              </ul>
              <NavLink to="/admin/orders" className="admin-dashboard-button">
                VIEW ORDERS
              </NavLink>
            </section>

            <section>
              <h2>Recent Users</h2>
              <ul>
                {users.map((u) => (
                  <li key={u._id}>{u.name}</li>
                ))}
              </ul>
              <NavLink to="/admin/users" className="admin-dashboard-button">
                VIEW USERS
              </NavLink>
            </section>
          </>
        )}
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
