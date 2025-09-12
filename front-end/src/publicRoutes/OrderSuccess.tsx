import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import SuccessLogo from "../assets/order-success.png";
import type { Order } from "../types/Order";

type RouteParams = { id: string };

const OrderSuccess = () => {
  const { id } = useParams<RouteParams>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const raw = localStorage.getItem("user");
        const userInfo = raw ? JSON.parse(raw) : null;
        if (!userInfo?.token || !id) return;

        const { data } = await api.get<Order>(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    if (location.search.includes("success")) {
      fetchOrder();
    }
  }, [id, location.search]);

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="success-container">
      <div className="success-content">
        <img src={SuccessLogo} className="success-logo" alt="Order success" />
        <h2 className="success-title">Payment Successful</h2>
        <p className="success-id">Order ID: {order._id}</p>

        <p className="success-price">
          Total Paid: <strong>${Number(order.totalPrice).toFixed(2)}</strong>
        </p>

        <h3 className="success-sub-title">Items:</h3>
        <ul>
          {order.orderItems.map((item, index) => {
            const key =
              typeof item.product === "string"
                ? item.product
                : item.product._id;
            return (
              <li key={key ?? index} className="success-items">
                <img
                  src={item.image}
                  alt={item.name}
                  className="success-image"
                />
                {item.name} x {item.quantity} - $
                {Number(item.price).toFixed(2)}
              </li>
            );
          })}
        </ul>

        <button
          className="return-to-home"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;