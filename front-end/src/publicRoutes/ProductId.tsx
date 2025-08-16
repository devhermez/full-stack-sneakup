import Nav from "./Nav.jsx";
import api from "./api.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./context/CartContext.jsx";

const ProductId = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching product", err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | SneakUp`;
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart({
      _id: product._id,
      product: product._id,
      name: product.name,
      image: product.images[0], // Main image
      price: product.price,
      quantity: 1,
      size: selectedSize,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-id-container">
      <Nav />
      <div className="product-details-content">
        <div className="products-details-card">
          <div className="product-details-images">
            {product.images.map((img, index) => {
              return (
                <img
                  key={index}
                  src={img}
                  className={`${product.name}-${index} product-imgs`}
                />
              );
            })}
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
              <strong>Gender:</strong> {product.gender}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Available Sizes:</strong>
              <select className="select-button"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {product.sizes.map((size) => (
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
    </div>
  );
};

export default ProductId;
