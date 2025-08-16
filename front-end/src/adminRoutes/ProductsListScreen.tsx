import api from "../api";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";

const ProductsListScreen = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      document.title = "Admin | Products"
    }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user.token]);

  if (loading) return <p>Loading products data...</p>;
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
                <td>{product.price.toFixed(2)}</td>
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
