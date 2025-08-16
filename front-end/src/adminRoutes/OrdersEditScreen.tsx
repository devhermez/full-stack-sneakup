import { AuthContext } from "../context/AuthContext";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import AdminFooter from "./AdminFooter.jsx";
import AdminNav from "./AdminNav.jsx";

const OrdersEditScreen = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrder(data);
      } catch (err) {
        setError("Error fetching order");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user.token]);

  if (loading) return <div>Loading order...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return null;

  return (
    <div className="admin-order-container">
      <AdminNav />
      <div className="admin-order-content">
        <h1 className="admin-users-title">SneakUp Admin</h1>
        <h3 className="admin-edit-sub-title">Order ID: {id}</h3>

        <div className="admin-order-information">
          <section className="order-section">
            <h3>User Info</h3>
            <p>Name: {order.user?.name}</p>
            <p>Email: {order.user?.email}</p>
          </section>

          <section className="order-section">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </section>

          <section className="order-section">
            <h3>Payment</h3>
            <p>Method: {order.paymentResult?.method || "N/A"}</p>
            <p>
              Status:{" "}
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : "Not Paid"}
            </p>
          </section>

          <section className="order-section">
            <h3>Delivery</h3>
            <p>
              Status:{" "}
              {order.isDelivered
                ? `Delivered on ${new Date(
                    order.deliveredAt
                  ).toLocaleDateString()}`
                : "Not Delivered"}
            </p>
          </section>

          <section className="order-section">
            <h3>Items</h3>
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity} – ${item.price.toFixed(2)} each
                </li>
              ))}
            </ul>
          </section>

          <section className="order-section">
            <h3>Total</h3>
            <p>${order.totalPrice.toFixed(2)}</p>
          </section>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default OrdersEditScreen;
