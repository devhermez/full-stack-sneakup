import React from "react";
import Nav from "./Nav.jsx";
import { useCart } from "./context/CartContext.jsx";
import { NavLink } from "react-router-dom";
import Company from './Company.jsx'
import Footer from './Footer.jsx'

const Cart = () => {
  const { cartItems, clearCart, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return (
    <div className="cart-container">
      <Nav />
      <div className="cart-content">
        <div className="cart-card">
          <div className="cart-section-1">
            <h1 className="cart-title">Your Shopping Cart</h1>
            <button className="button-clear-cart" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
          <div className="cart-section-2">
            {cartItems.length === 0 ? (
              <p className="cart-empty">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                return (
                  <div key={item._id} className="cart-item">
                    <img src={item.image} alt="" className="cart-image" />
                    <h3 className="cart-name">{item.name}</h3>
                    <p className="cart-size">
                      Size: {item.size}
                    </p>
                    <p className="cart-price">
                      ${item.price} x {item.quantity}
                    </p>
                    
                    <button
                      className="button-remove-to-cart"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div className="cart-section-3">
            <p className="cart-total">
              <strong>Total: ${total.toFixed(2)}</strong>
            </p>
            <NavLink to="/checkout">
              <button className="button-checkout">Proceed to checkout</button>
            </NavLink>
          </div>
        </div>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Cart;
