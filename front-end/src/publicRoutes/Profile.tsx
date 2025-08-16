import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav.jsx";
import Company from './Company.jsx';
import Footer from './Footer.jsx';
const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <Nav />
      <div className="profile-content">
        <div className="profile-card">
          <h1 className="profile-title">My Profile</h1>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <Company />
      <Footer />
    </div>
  );
};

export default Profile;
