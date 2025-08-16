import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api.js";
import SuccessLogo from './assets/order-success.png';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        const { data } = await api.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
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
        <img src={SuccessLogo} className='success-logo'alt="" />
        <h2 className="success-title">Payment Successful</h2>
        <p className="success-id">Order ID: {order._id}</p>
        <p className="success-price">
          Total Paid: <strong>${order.totalPrice.toFixed(2)}</strong>
        </p>
        <h3 className="success-sub-title">Items:</h3>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item._id} className="success-items">
              <img src={item.image} alt={item.name} className="success-image"/>
              {item.name} x {item.quantity} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <button
          className="return-to-home"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
