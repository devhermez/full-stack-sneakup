import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";

const AdminFooter = () => {
  return (
    <div className="copyright-container div-red">
      <p>© 2025 Hermez. All rights reserved.</p>
      <a
        href="https://www.linkedin.com/in/kim-hermes-buendia-0605b3303/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin />
      </a>
      <a
        href="https://github.com/devhermez"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </a>
      <a href="https://hermez.dev/" target="_blank" rel="noopener noreferrer">
        <FiGlobe />
      </a>
    </div>
  );
};

export default AdminFooter;