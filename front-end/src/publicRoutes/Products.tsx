import React, { useEffect, useState, useMemo } from "react";
import Nav from "./Nav.jsx";
import api from "./api.js";
import { useLocation, Link } from "react-router-dom";
import Company from "./Company.jsx";
import Footer from "./Footer.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching data", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearch(q);
  }, [location.search]);

  // Unique category list (adds "All" at the top)
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  // Search + Category filter
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !term || String(p.name).toLowerCase().includes(term);
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div className="products-container">
      <Nav />
      <div className="products-content-container">
        <h1 className="gender-title">PRODUCTS</h1>
        {/* ===== Filter Bar ===== */}
        <div className="products-filterbar">
          <div className="filter-group">
            <label htmlFor="category" className="filter-label">
              Category
            </label>
            <select
              id="category"
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group filter-search">
            <label htmlFor="search" className="filter-label">
              Search
            </label>
            <input
              id="search"
              className="filter-input"
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="filter-clear"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear
          </button>
        </div>
        {/* ====================== */}

        <div className="products-items">
          {filtered.map((shoe, index) => {
            return (
              <Link to={`/products/${shoe._id}`}>
                <div
                  key={shoe._id}
                  className={`shoe-card shoe-card-${index + 1}`}
                >
                  <img
                    src={shoe.images[0]}
                    alt=""
                    className={`shoe-img shoe-img-${index + 1}`}
                  />

                  <h3 className={`shoe-name shoe-name-${index + 1}`}>
                    {shoe.name}
                  </h3>
                  <p className={`shoe-gender shoe-gender-${index + 1}`}>
                    {shoe.gender}
                  </p>
                  <p
                    className={`shoe-description shoe-description-${index + 1}`}
                  >
                    {shoe.description}
                  </p>
                  <p className={`shoe-price shoe-price-${index + 1}`}>
                    ${shoe.price}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Products;
