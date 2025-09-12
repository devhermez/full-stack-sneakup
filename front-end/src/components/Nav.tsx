import { useState, useContext, type FormEvent, type ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaSearch, FaTimes } from "react-icons/fa";
import "../App.scss";
import aiicon from "../assets/ai-icon.png";
import { AuthContext } from "../context/AuthContext";
import SneakUpLogo from "../assets/sneakup-icon-black.png";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const navigate = useNavigate();

  const { user } = useContext(AuthContext) as { user: any };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = navSearch.trim();
    navigate(`/products${q ? `?search=${encodeURIComponent(q)}` : ""}`);
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNavSearch(e.target.value);
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <div className="nav-container">
      <div className="nav-logo-container">
        <NavLink to="/" className="nav-link">
          <img src={SneakUpLogo} alt="SneakUp" className="sneakup-logo" />
        </NavLink>
      </div>

      <div className="nav-links-container">
        <NavLink className="nav-link" to="/products">
          PRODUCTS
        </NavLink>
        <NavLink className="nav-link" to="/products/men">
          MEN
        </NavLink>
        <NavLink className="nav-link" to="/products/women">
          WOMEN
        </NavLink>
        <NavLink className="nav-link ai-link" to="/visual-search">
          <img src={aiicon} alt="AI" className="ai-icon" />
          AI VISUAL SEARCH
        </NavLink>
      </div>

      <div className="nav-functions-container">
        <form className="search-form-container" onSubmit={onSubmit}>
          <input
            className="input-search"
            type="search"
            placeholder="Search..."
            aria-label="Search"
            value={navSearch}
            onChange={onSearchChange}
          />
          <button type="submit" className="search-button" aria-label="Search">
            <FaSearch className="desktop-search" />
          </button>
        </form>

        <NavLink className="link-icon" to="/products" aria-label="Search">
          <FaSearch className="non-desktop-icons" size={24} />
        </NavLink>

        <NavLink className="link-icon" to="/cart" aria-label="Cart">
          <FaShoppingCart size={24} />
        </NavLink>

        <NavLink
          className="link-icon"
          to={user ? "/profile" : "/login"}
          title={user ? "Profile" : "Login"}
          aria-label={user ? "Profile" : "Login"}
        >
          <FaUserCircle size={24} />
        </NavLink>

        <FaBars className="non-desktop-icons" size={24} onClick={toggleMenu} />
      </div>

      {isMenuOpen && (
        <div className="nav-burger-menu">
          <button className="burger-close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <FaTimes size={24} />
          </button>
          <NavLink to="/" className="nav-link burger-link">
            <p className="nav-logo">HOME</p>
          </NavLink>
          <NavLink className="nav-link burger-link" to="/products">
            PRODUCTS
          </NavLink>
          <NavLink className="nav-link burger-link" to="/products/men">
            MEN
          </NavLink>
          <NavLink className="nav-link burger-link" to="/products/women">
            WOMEN
          </NavLink>
          <NavLink className="nav-link burger-link" to="/profile">
            PROFILE
          </NavLink>
          <NavLink className="nav-link burger-link" to="/cart">
            CART
          </NavLink>
          <NavLink className="nav-link ai-link" to="/visual-search">
            <img src={aiicon} alt="AI" className="ai-icon" />
            AI VISUAL SEARCH
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Nav;