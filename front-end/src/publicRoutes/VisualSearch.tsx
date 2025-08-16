import React from "react";
import { useState } from "react";
import api from "./api.js";
import axios from "axios";
import aiApi from "./aiApi.js";
import Nav from "./Nav.jsx";
import FileInput from "./FileInput.jsx";
import aiicon from "./assets/ai-icon.PNG";
import { NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const VisualSearch = () => {
  const [imageFile, setImageFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSearch = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const aiRes = await aiApi.post("/api/search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const matchedIds = aiRes.data.matches;

      const backendRes = await api.post("/api/products/by-ids", {
        ids: matchedIds,
      });

      setResults(backendRes.data);
    } catch (err) {
      console.error("Visual Search Failed", err);
    }
    setLoading(false);
  };
  return (
    <div className="visual-search-container">
      <NavLink to="/" className='return-home-link'>
        <FaArrowLeft />
        RETURN TO HOME
      </NavLink>

      <div className="visual-search-content">
        <div>
          <img className="vs-ai-icon" src={aiicon} alt="" />
          <h1 className="visual-search-title">AI Visual Search</h1>
        </div>

        <p className="visual-search-description">
          Find exactly what you might be looking for!
        </p>
        <div className="vs-left">
          <FileInput />
          <button className="button-vs-search" onClick={handleSearch}>
            {loading ? "Searching..." : "Search Similar Products"}
          </button>
        </div>
        <div className="vs-results">
          {results.map((product) => (
            <div key={product._id} className="vs-result-card">
              <img src={product.images[0]} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;
