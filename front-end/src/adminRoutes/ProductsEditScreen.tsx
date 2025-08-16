import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api.js";
import AdminNav from "./AdminNav.jsx";
import AdminFooter from "./AdminFooter.jsx";

const ProductsEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    gender: "",
    price: 0,
    stock: 0,
    description: "",
    images: [],
    sizes: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch product
  useEffect(() => {
    const controller = new AbortController();
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
          signal: controller.signal,
        });
        setProduct(data);
        setForm({
          name: data.name ?? "",
          brand: data.brand ?? "",
          category: data.category ?? "",
          gender: data.gender ?? "",
          price: Number(data.price ?? 0),
          stock: Number(data.stock ?? 0),
          description: data.description ?? "",
          images: Array.isArray(data.images) ? data.images : [],
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Error fetching product");
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchProduct();
    return () => controller.abort();
  }, [id, user.token]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      setForm((f) => ({ ...f, [name]: value === "" ? "" : Number(value) }));
    } else if (name === "imagesCsv") {
      setForm((f) => ({
        ...f,
        images: value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
    } else if (name === "sizesCsv") {
      setForm((f) => ({
        ...f,
        sizes: value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // basic validation
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.brand.trim()) return setError("Brand is required.");
    if (!form.category.trim()) return setError("Category is required.");
    if (!form.gender.trim()) return setError("Gender is required.");
    if (Number.isNaN(form.price) || form.price < 0)
      return setError("Price must be a non-negative number.");
    if (!Number.isInteger(form.stock) || form.stock < 0)
      return setError("Stock must be a non-negative integer.");

    setSaving(true);
    try {
      await api.put(
        `/api/products/${id}`,
        {
          name: form.name,
          brand: form.brand,
          category: form.category,
          gender: form.gender,
          price: form.price,
          stock: form.stock,
          description: form.description,
          images: form.images,
          sizes: form.sizes,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate("/admin/products"); // go back to list
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => navigate(-1);

  if (loading) return <p>Loading product data...</p>;
  if (!product) return <p className="error">{error || "Product not found."}</p>;

  return (
    <div className="admin-product-container">
      <AdminNav />
      <div
        className="admin-product-content"
        
      >
        <h1 className="admin-edit-title">SneakUp Admin</h1>
        <h3 className="admin-edit-sub-title">Product Information</h3>

        {error && (
          <div className="error" style={{ color: "crimson", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label>
            Name: 
            <input
              name="name"
              type="text"
              className="form-product-input"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Air Zoom"
              required
            />
          </label>

          <label>
            Brand:
            <input
            className="form-product-input"
              name="brand"
              type="text"
              value={form.brand}
              onChange={onChange}
              placeholder="e.g., Nike"
              required
            />
          </label>

          <label>
            Category:
            <input
            className="form-product-input"
              name="category"
              type="text"
              value={form.category}
              onChange={onChange}
              placeholder="e.g., Sneakers"
              required
            />
          </label>

          <label>
            Gender:
            <select
            className="form-product-input"
              name="gender"
              value={form.gender}
              onChange={onChange}
              required
            >
              <option value="">Select…</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Kids</option>
            </select>
          </label>

          <label>
            Price:
            <input
            className="form-product-input"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Stock:
            <input
            className="form-product-input"
              name="stock"
              type="number"
              step="1"
              min="0"
              value={form.stock}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
            className="form-product-input"
              name="description"
              rows={4}
              value={form.description}
              onChange={onChange}
              placeholder="Product details…"
            />
          </label>

          <label>
            Images (comma-separated URLs):
            <input
            className="form-product-input"
              name="imagesCsv"
              type="text"
              value={form.images.join(", ")}
              onChange={onChange}
              placeholder="https://..., https://..."
            />
          </label>

          <label>
            Sizes (comma-separated):
            <input
            className="form-product-input"
              name="sizesCsv"
              type="text"
              value={form.sizes.join(", ")}
              onChange={onChange}
              placeholder="e.g., 7, 8, 9, 10"
            />
          </label>

          <div className="admin-product-edit-buttons"style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "space-between" }}>
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <AdminFooter />
    </div>
  );
};

export default ProductsEditScreen;
