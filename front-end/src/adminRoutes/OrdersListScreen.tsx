import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import api from "../api";

import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";

import type { Order } from "../types/Order";
import type { User } from "../types/User";

const OrdersListScreen = () => {
  const { user } = useContext(AuthContext) as { user: User | null };

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin | Orders";
  }, []);

  useEffect(() => {
    if (!user?.token) {
      setError("You must be logged in to view orders.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get<Order[]>("/api/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (err) {
        setError("Error fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.token]);

  if (loading) return <div className="loader">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-products-container">
      <AdminNav />
      <div className="admin-products-content">
        <h1 className="admin-gen-title">SneakUp Admin</h1>
        <h3 className="admin-gen-sub-title">All Orders</h3>
        <table className="admin-products-table">
          <thead>
            <tr>
              <th className="order-id">ID</th>
              <th className="order-user">User</th>
              <th className="order-items">Items</th>
              <th className="order-total">Total</th>
              <th className="order-paid">Paid</th>
              <th className="order-delivered">Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}...</td>
                <td>
                  {typeof order.user === "object" && order.user?.name
                    ? order.user.name
                    : "Guest"}
                </td>
                <td className="order-items">{order.orderItems?.length}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td className="order-paid">
                  {order.isPaid && order.paidAt
                    ? new Date(order.paidAt).toLocaleDateString()
                    : "No"}
                </td>
                <td className="order-delivered">
                  {order.isDelivered && order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleDateString()
                    : "No"}
                </td>
                <td>
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="admin-gen-link"
                  >
                    View
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

export default OrdersListScreen;