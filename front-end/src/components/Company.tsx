import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";

const Company = () => {
  return (
    <div className="company-info-container">
      <div className="company-content-1">
        <h3 className="company-content-title">ABOUT US</h3>
        <p className="company-contents">About SneakUp</p>
        <p className="company-contents">Careers</p>
        <p className="company-contents">News</p>
        <p className="company-contents">Feedback</p>
      </div>

      <div className="company-content-2">
        <h3 className="company-content-title">PRODUCTS</h3>
        <p className="company-contents">Top Sellers</p>
        <p className="company-contents">Running</p>
        <p className="company-contents">Casual</p>
        <p className="company-contents">Training</p>
        <p className="company-contents">Basketball</p>
      </div>
      <div className="company-content-3">
        <h3 className="company-content-title">SUPPORT</h3>
        <p className="company-contents">Find a store</p>
        <p className="company-contents">Discounts</p>
        <p className="company-contents">Payments</p>
        <p className="company-contents">Delivery</p>
        <p className="company-contents">Return & Refunds</p>
        <p className="company-contents">Customer Services</p>
      </div>
      <div className="company-content-3">
        <h3 className="company-content-title">FOLLOW US</h3>
        <div className="social-icons">
          <a
            href="https://instagram.com/yourhandle"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/yourhandle"
            aria-label="X"
            target="_blank"
            rel="noreferrer"
          >
            <FaXTwitter />
            {/* or <FaTwitter /> */}
          </a>
          <a
            href="https://facebook.com/yourhandle"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook />
          </a>
         
          
        </div>
      </div>
    </div>
  );
};

export default Company;
