import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import api from "../api";
import { AuthContext } from "../context/AuthContext";

import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";

import type { Product } from "../types/Product";
import type { User } from "../types/User";

const ProductsListScreen = () => {
  const { user } = useContext(AuthContext) as { user: User | null };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin | Products";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        if (!user?.token) {
          setError("You must be logged in to view products.");
          return;
        }

        const { data } = await api.get<Product[]>("/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
          signal: controller.signal,
        });

        setProducts(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error fetching products", err);
          setError("Error fetching products");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [user?.token]);

  if (loading) return <p>Loading products data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-products-container">
      <AdminNav />
      <div className="admin-products-content">
        <h1 className="admin-gen-title">SneakUp Admin</h1>
        <h3 className="admin-gen-sub-title">All Products</h3>

        <table className="admin-products-table">
          <thead>
            <tr>
              <th className="th-title">Name</th>
              <th className="th-title">Price</th>
              <th className="th-title">Stock</th>
              <th className="th-title"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="td-product-name">{product.name}</td>
                <td>{Number(product.price).toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <Link
                    to={`/admin/product/${product._id}/edit`}
                    className="admin-gen-link"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminFooter />
    </div>
  );
};

export default ProductsListScreen;