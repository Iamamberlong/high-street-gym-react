import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../features/authentication";
import {
  faCalendarDays,
  faList,
  faUser,
  faRightFromBracket,
  faPenToSquare,
  faPlus,
  faPhone,
  faBlog
} from "@fortawesome/free-solid-svg-icons";
import LogoutIcon from "./LogoutIcon";


const Footer = () => {
  const [user, login, logout] = useAuthentication();
  const navigate = useNavigate();

  function onLogoutClick(e) {
    e.preventDefault(); // Prevent default link behavior
    logout();
    navigate("/");
  }

  return (
    <footer className="bg-blue-500 text-white py-6 w-full sticky bottom-0">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        {/* Social Media Icons */}
        <div className="flex space-x-6">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-white hover:text-blue-600"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-white hover:text-blue-400"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white hover:text-pink-600"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white hover:text-gray-400"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
        </div>

        {/* Internal Links */}
        <div className="md:hidden flex flex-wrap justify-center space-x-10 mt-5">
          {/* Conditionally render additional links based on user role */}
          <Link to="/classes" className="text-white hover:text-gray-400">
            <FontAwesomeIcon icon={faCalendarDays} size="2x" />
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <>
                  <Link
                    to="/create-class"
                    className="text-white hover:text-gray-400"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="2x"
                    ></FontAwesomeIcon>
                  </Link>
                  <Link to="/upload" className="text-white hover:text-gray-400">
                    <FontAwesomeIcon icon={faPlus} size="2x"></FontAwesomeIcon>
                  </Link>
                </>
              )}
              {user.role === "trainer" && (
                <>
                  <Link
                    to="/create-class"
                    className="text-white hover:text-gray-400"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="2x"
                    ></FontAwesomeIcon>
                  </Link>
                </>
              )}
              {user.role === "member" && (
                <>
                  <Link
                    to="/my-bookings"
                    className="text-white hover:text-gray-400"
                  >
                    {" "}
                    <FontAwesomeIcon icon={faList} size="2x" />
                  </Link>
                </>
              )}
              <Link><LogoutIcon /></Link>
                
            
            </>
          ) : (
            <>
              <Link to="/locations" className="text-white hover:text-gray-400">
                <FontAwesomeIcon icon={faPhone} size="2x"></FontAwesomeIcon>
              </Link>
              <Link to="/blogs" className="text-white hover:text-gray-400">
                <FontAwesomeIcon icon={faBlog} size="2x"></FontAwesomeIcon>
              </Link>
            </>
          )}
        </div>

        {/* Copyright */}
        <p className="text-center text-slate-50 mt-4">
          &copy; {new Date().getFullYear()} High Street Gym. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;