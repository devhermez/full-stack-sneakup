import {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
  useRef,
} from "react";
import { FaCircleCheck } from "react-icons/fa6";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const hideTimer = useRef(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const flashPopup = (msg = "Added to cart ✅", ms = 3000) => {
    setPopupMsg(msg);
    setShowPopup(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowPopup(false), ms);
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          { ...product, _id: product._id, product: product._id, quantity: 1 },
        ];
      }
    });

    flashPopup(`Added ${product.name || "item"} to cart successfully`);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
      {showPopup && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "24px",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "14px",
            zIndex: 2000,
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {popupMsg}
          <FaCircleCheck size={18} color="#ffffffff" aria-hidden="true" />
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
