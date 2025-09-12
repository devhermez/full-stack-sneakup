import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import Nav from "../components/Nav";
import Company from "../components/Company";
import Footer from "../components/Footer";

import type { Order } from "../types/Order";
import type { User } from "../types/User";
import type { Product } from "../types/Product";

const Profile = () => {
  const { user, logout } = useContext(AuthContext) as {
    user: (User & { token?: string }) | null;
    logout: () => void;
  };

  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Fetch a few products to suggest
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get<Product[]>("/api/products");
        setProducts(data.slice(0, 6));
      } catch (e) {
        console.error("Error fetching products", e);
      }
    };
    fetchProducts();
  }, []); // ← avoid re-fetch loop

  // Fetch current user's orders
  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      setErr("");
      setLoading(true);

      try {
        const { data } = await api.get<Order[]>("/api/orders/user", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!cancelled) setOrders(data ?? []);
      } catch {
        if (!cancelled) setErr("Failed to load your orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [user?.token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <Nav />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-information-card">
            <div className="profile-info-1">
              <h1 className="profile-title">My Profile</h1>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div className="profile-info-2">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>

          <div className="profile-orders-card">
            <h2 className="profile-subtitle">My Orders</h2>
            <div className="profile-orders">
              {loading && <p>Loading your orders…</p>}
              {err && <p className="error-message">{err}</p>}

              {!loading &&
                !err &&
                (orders.length === 0 ? (
                  <p>You don’t have any orders yet.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o._id} className="order-item">
                      <p>
                        <strong>Order ID:</strong> {o._id}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                      <p>
                        <strong>Total:</strong> $
                        {Number(o.totalPrice).toFixed(2)}
                      </p>
                      <p>
                        <strong>Paid:</strong> {o.isPaid ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Delivered:</strong>{" "}
                        {o.isDelivered ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Items:</strong> {o.orderItems?.length ?? 0}
                      </p>
                      <hr />
                    </div>
                  ))
                ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="profile-suggestions" style={{ marginTop: 24 }}>
            <h2 className="profile-subtitle">You might also like</h2>
            <div
              className="suggestions-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
                marginTop: 12,
              }}
            >
              {products.map((item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="product-suggested-card"
                  style={{
                    display: "block",
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 12,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                  <p style={{ fontWeight: 600 }}>{item.name}</p>
                  <p style={{ opacity: 0.8, fontSize: 14, marginTop: 4 }}>
                    ${Number(item.price).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          {/* /Suggestions */}
        </div>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Profile;
