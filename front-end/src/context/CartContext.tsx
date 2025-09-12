import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { FaCircleCheck } from "react-icons/fa6";
import type { Product } from "../types/Product";

export interface CartItem extends Product {
  _id: string;
  product: string;         // product id ref
  quantity: number;
  selectedSize?: string;   // NEW: chosen variant
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, opts?: { selectedSize?: string }) => void; // changed
  removeFromCart: (id: string, selectedSize?: string) => void;             // changed
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) setCartItems(JSON.parse(stored));
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

  const addToCart: CartContextType["addToCart"] = (product, opts) => {
    const size = opts?.selectedSize; // may be undefined
    setCartItems(prev => {
      // find line with SAME product + SAME selected size
      const existing = prev.find(
        i => i._id === product._id && i.selectedSize === size
      );
      if (existing) {
        return prev.map(i =>
          i._id === product._id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      // add a new line
      return [
        ...prev,
        {
          ...product,
          _id: product._id,
          product: product._id,
          quantity: 1,
          selectedSize: size,
        },
      ];
    });
    flashPopup(`Added ${product.name}${opts?.selectedSize ? ` (Size ${opts.selectedSize})` : ""}`);
  };

  const removeFromCart: CartContextType["removeFromCart"] = (id, selectedSize) => {
    setCartItems(prev =>
      prev.filter(i => !(i._id === id && i.selectedSize === selectedSize))
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
      {showPopup && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 14,
            zIndex: 2000,
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          {popupMsg}
          <FaCircleCheck size={18} color="#fff" aria-hidden="true" />
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};