import Nav from "../components/Nav";
import api from "../api";
import Company from "../components/Company";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useState, type ChangeEvent } from "react";

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type StoredUser = { token: string } | null;

const Checkout = () => {
  const { cartItems } = useCart();
  const [shipping, setShipping] = useState<ShippingAddress>({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userInfo: StoredUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        return null;
      }
    })();

    if (!userInfo?.token) {
      setLoading(false);
      setError("You must be logged in to place an order.");
      return;
    }

    try {
      // Create order (note: image + size pulled from cart item shape)
      const createRes = await api.post(
        "/api/orders",
        {
          orderItems: cartItems.map((item) => ({
            product: item._id, // backend expects product id
            name: item.name,
            image: item.images?.[0] ?? "",
            price: Number(item.price),
            quantity: Number(item.quantity),
            size: item.selectedSize, // <-- important
          })),
          shippingAddress: shipping,
          itemsPrice: totalPrice,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      const orderId: string = createRes.data._id;

      // Create Stripe session
      const sessionRes = await api.post(
        `/api/orders/${orderId}/create-checkout-session`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      // Redirect to Stripe
      window.location.href = sessionRes.data.url as string;
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Something went wrong.");
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
            />
            <input
              className="form-city"
              name="city"
              type="text"
              onChange={handleChange}
              value={shipping.city}
              placeholder="City"
              required
            />
            <input
              className="form-postal-code"
              name="postalCode"
              type="text"
              onChange={handleChange}
              value={shipping.postalCode}
              placeholder="Postal Code"
              required
            />
            <input
              className="form-country"
              name="country"
              type="text"
              onChange={handleChange}
              value={shipping.country}
              placeholder="Country"
              required
            />

            {error && (
              <div className="error-message" style={{ marginTop: 8 }}>
                {error}
              </div>
            )}

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
          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.selectedSize ?? "nosize"}`}
              className="item-checkout-card"
            >
              <img
                src={item.images?.[0] ?? ""}
                alt={item.name}
                className="item-checkout-img"
              />
              <h4 className="item-checkout-name">{item.name}</h4>
              {item.selectedSize && (
                <p className="item-checkout-size">Size: {item.selectedSize}</p>
              )}
              <p className="item-checkout-price">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          ))}
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
