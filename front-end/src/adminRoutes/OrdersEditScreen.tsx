import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import api from "../api.ts"; 

import AdminFooter from "./AdminFooter.tsx";
import AdminNav from "./AdminNav.tsx";

import type { Order } from "../types/Order";
import type { User } from "../types/User";

type RouteParams = {
  id: string;
};

const OrdersEditScreen = () => {
  const { id } = useParams<RouteParams>();
  const { user } = useContext(AuthContext) as { user: User | null };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing order id in the route.");
      setLoading(false);
      return;
    }
    if (!user?.token) {
      setError("You must be logged in to view this order.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get<Order>(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user?.token]);

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
            <p>Method: {order.paymentResult?.method ?? "N/A"}</p>
            <p>
              Status:{" "}
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt!).toLocaleDateString()}`
                : "Not Paid"}
            </p>
          </section>

          <section className="order-section">
            <h3>Delivery</h3>
            <p>
              Status:{" "}
              {order.isDelivered
                ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}`
                : "Not Delivered"}
            </p>
          </section>

          <section className="order-section">
            <h3>Items</h3>
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity} – $
                  {Number(item.price).toFixed(2)} each
                </li>
              ))}
            </ul>
          </section>

          <section className="order-section">
            <h3>Total</h3>
            <p>${Number(order.totalPrice).toFixed(2)}</p>
          </section>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default OrdersEditScreen;