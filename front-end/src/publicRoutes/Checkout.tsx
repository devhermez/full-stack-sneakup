import React from "react";
import Nav from "./Nav.jsx";
import api from "./api.js";
import { useCart } from "./context/CartContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Company from './Company.jsx';
import Footer from './Footer.jsx';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    e.preventDefault();
    setLoading(true);
    setError("");

    // ADD THIS DEBUG CODE:
    console.log("Cart items:", cartItems);
    console.log("First item _id:", cartItems[0]?._id);
    console.log(
      "Mapped order items:",
      cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      }))
    );

    try {
      const res = await api.post(
        "/api/orders",
        {
          orderItems: cartItems.map((item) => ({
            product: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
          })),
          shippingAddress: shipping,
          itemsPrice: totalPrice,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const orderId = res.data._id;

      const sessionRes = await api.post(
        `/api/orders/${orderId}/create-checkout-session`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      window.location.href = sessionRes.data.url;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <Nav />
      <div className="checkout-content">
        <div className="checkout-left">
          <h2 className="checkout-title">SHIPPING INFORMATION</h2>
          
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            <h3 className="form-title">Enter your shipping details below.</h3>
            
            <input
              className="form-address"
              name="address"
              type="text"
              onChange={handleChange}
              value={shipping.address}
              placeholder="Address"
              required
            ></input>
            <input
              className="form-city"
              name="city"
              type="text"
              onChange={handleChange}
              value={shipping.city}
              placeholder="City"
              required
            ></input>
            <input
              className="form-postal-code"
              name="postalCode"
              type="text"
              onChange={handleChange}
              value={shipping.postalCode}
              placeholder="Postal Code"
              required
            ></input>
            <input
              className="form-country"
              name="country"
              type="text"
              onChange={handleChange}
              value={shipping.country}
              placeholder="Country"
              required
            ></input>
            <button
              type="submit"
              className="button-checkout"
              disabled={loading}
            >
              {loading ? "Placing order" : "Checkout"}
            </button>
          </form>
        </div>
        <div className="checkout-right">
          <h3 className="summary-title">Order Summary</h3>
          {cartItems.map((item) => {
            return (
              <div key={item._id} className="item-checkout-card">
                <img src={item.image} alt="" className="item-checkout-img" />
                <h4 className="item-checkout-name">{item.name}</h4>
                <p className="item-checkout-price">${item.price.toFixed(2)}</p>
              </div>
            );
          })}
          <p className="item-checkout-total">
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </p>
        </div>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Checkout;
