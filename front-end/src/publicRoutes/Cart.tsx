import { NavLink } from "react-router-dom";
import Nav from "../components/Nav";
import { useCart } from "../context/CartContext";
import Company from "../components/Company";
import Footer from "../components/Footer";

const Cart = () => {
  const { cartItems, clearCart, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
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
              cartItems.map((item) => (
                <div
                  key={`${item._id}-${item.selectedSize ?? "nosize"}`}
                  className="cart-item"
                >
                  <img
                    src={item.images?.[0] ?? ""}
                    alt={item.name}
                    className="cart-image"
                  />
                  <h3 className="cart-name">{item.name}</h3>
                  {/* Size omitted because CartItem doesn't carry a selected size */}
                  {item.selectedSize && (
                    <p className="cart-size">Size: {item.selectedSize}</p>
                  )}
                  <button
                    className="button-remove-to-cart"
                    onClick={() => removeFromCart(item._id, item.selectedSize)}
                  >
                    Remove
                  </button>
                </div>
              ))
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
