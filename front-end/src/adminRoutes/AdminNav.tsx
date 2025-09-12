import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import SneakUpLogo from "../assets/sneakup-icon-white.png";

const AdminNav = () => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsAdminMenuOpen((prev) => !prev);
  };

  return (
    <div className="div-red admin-nav">
      <NavLink to="/" className="nav-link">
        <img src={SneakUpLogo} alt="SneakUp" className="admin-sneakup-logo" />
      </NavLink>

      <NavLink to="/admin" className="admin-nav-link">
        DASHBOARD
      </NavLink>
      <NavLink to="/admin/users" className="admin-nav-link">
        USERS
      </NavLink>
      <NavLink to="/admin/products" className="admin-nav-link">
        PRODUCTS
      </NavLink>
      <NavLink to="/admin/orders" className="admin-nav-link">
        ORDERS
      </NavLink>

      <FaBars
        className="non-desktop-icons admin-nav-burger"
        size={24}
        onClick={toggleMenu}
      />

      {isAdminMenuOpen && (
        <div className="nav-burger-menu">
          <button
            className="burger-close-btn"
            onClick={() => setIsAdminMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes size={24} />
          </button>

          <NavLink to="/admin" className="nav-link burger-link">
            <p className="nav-logo">DASHBOARD</p>
          </NavLink>
          <NavLink className="nav-link burger-link" to="/admin/products">
            PRODUCTS
          </NavLink>
          <NavLink className="nav-link burger-link" to="/admin/users">
            USERS
          </NavLink>
          <NavLink className="nav-link burger-link" to="/admin/orders">
            ORDERS
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default AdminNav;