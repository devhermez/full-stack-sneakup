import { useState, type ChangeEvent } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import api from "../api";
import aiApi from "../aiApi";
import FileInput from "../components/FileInput";
import aiicon from "../assets/ai-icon.png"; // adjust case to match the actual file
import type { Product } from "../types/Product";

type AIResponse = { matches: string[] };

const VisualSearch = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] ?? null);
  };

  const handleSearch = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const aiRes = await aiApi.post<AIResponse>("/api/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const matchedIds = aiRes.data.matches ?? [];

      const backendRes = await api.post<Product[]>("/api/products/by-ids", {
        ids: matchedIds,
      });

      setResults(backendRes.data);
    } catch (err) {
      console.error("Visual Search Failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="visual-search-container">
      <NavLink to="/" className="return-home-link">
        <FaArrowLeft />
        RETURN TO HOME
      </NavLink>

      <div className="visual-search-content">
        <div>
          <img className="vs-ai-icon" src={aiicon} alt="AI icon" />
          <h1 className="visual-search-title">AI Visual Search</h1>
        </div>

        <p className="visual-search-description">
          Find exactly what you might be looking for!
        </p>

        <div className="vs-left">
          <FileInput onChange={handleFileChange} />
          <button className="button-vs-search" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search Similar Products"}
          </button>
        </div>

        <div className="vs-results">
          {results.map((product) => (
            <div key={product._id} className="vs-result-card">
              <img src={product.images?.[0]} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>${Number(product.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;