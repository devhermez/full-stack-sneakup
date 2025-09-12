import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Company from "../components/Company";
import Footer from "../components/Footer";

import Nav from "../components/Nav";
import api from "../api";

import type { Product } from "../types/Product";

type RouteParams = { id: string };

const ProductId = () => {
  const { addToCart } = useCart();
  const { id } = useParams<RouteParams>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const res = await api.get<Product>(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | SneakUp`;
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!product) return;

    // NOTE: Your CartContext currently accepts only Product.
    // If you want to persist the *chosen* size, extend CartContext/CartItem to include it.
    addToCart(product, { selectedSize });
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-id-container">
      <Nav />
      <div className="product-details-content">
        <div className="products-details-card">
          <div className="product-details-images">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} - ${index + 1}`}
                className={`${product.name}-${index} product-imgs`}
              />
            ))}
          </div>

          <div className="product-details-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Gender:</strong> {String(product.gender)}
            </p>
            <p>
              <strong>Price:</strong> ${Number(product.price ?? 0).toFixed(2)}
            </p>
            <p>
              <strong>Available Sizes:</strong>
              <select
                className="select-button"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {(product.sizes ?? []).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </p>
            <button
              className="button-add-to-cart product-details-add-to-cart"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Add to Cart
            </button>
          </div>
        </div>
        
      </div>
      <Company />
        <Footer />
    </div>
  );
};

export default ProductId;
