import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api.js";
import { Link } from "react-router-dom";
import AdminNav from "./AdminNav.jsx";
import AdminFooter from "./AdminFooter.jsx";

const OrdersListScreen = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    document.title = "Admin | Orders"
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
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
  }, [user.token]);

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
                <td>{order.user?.name || "Guest"}</td>
                <td className="order-items">{order.orderItems?.length}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td className="order-paid">
                  {order.isPaid
                    ? new Date(order.paidAt).toLocaleDateString()
                    : "No"}
                </td>
                <td className="order-delivered">
                  {order.isDelivered
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
