
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";

const Footer = () => {
  return (
    <div className="copyright-container">
      <p>© 2025 Hermez. All rights reserved. </p>
      <a href="https://www.linkedin.com/in/kim-hermes-buendia-0605b3303/">
        <FaLinkedin  />
      </a>
      <a href="https://github.com/devhermez">
        <FaGithub  />
      </a>
      <a href="https://hermez.dev/">
        <FiGlobe />
      </a>
    </div>
  );
};

export default Footer;
