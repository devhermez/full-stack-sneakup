import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import api from "../api";
import Company from "../components/Company";
import Footer from "../components/Footer";
import type { Product } from "../types/Product";

const Men = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get<Product[]>("/api/products");
        setProducts(data);
      } catch (err) {
        setError("Failed to load products.");
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const isMenOrUnisex = (g: unknown): boolean => {
    if (!g) return false;
    if (Array.isArray(g)) return g.some(isMenOrUnisex);
    const v = String(g).toLowerCase();
    return v === "men" || v === "unisex";
  };

  const menProducts = useMemo(
    () => products.filter((p) => isMenOrUnisex(p.gender)),
    [products]
  );

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!menProducts.length) return <div>No men’s products yet.</div>;

  return (
    <div className="gender-container">
      <Nav />
      <div className="gender-content">
        <h1 className="gender-title">MEN'S PRODUCTS</h1>
        <p className="page-description">
          Discover the latest men’s sneakers—from running shoes to basketball
          classics.
        </p>
        <div className="gender-items">
          {menProducts.map((p, index) => (
            <Link key={p._id} to={`/products/${p._id}`}>
              <div className={`shoe-card shoe-card-${index + 1}`}>
                <img
                  src={p.images?.[0]}
                  alt={`${p.name} product image`}
                  className={`shoe-img shoe-img-${index + 1}`}
                />
                <h3 className={`shoe-name shoe-name-${index + 1}`}>{p.name}</h3>
                <p className={`shoe-gender shoe-gender-${index + 1}`}>
                  {String(p.gender).charAt(0).toUpperCase() +
                    String(p.gender).slice(1)}
                </p>
                <p className={`shoe-description shoe-description-${index + 1}`}>
                  {p.description}
                </p>
                <p className={`shoe-price shoe-price-${index + 1}`}>
                  ${Number(p.price ?? 0).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Men;
