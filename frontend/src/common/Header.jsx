import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import logo from "../assets/logo-no-background.png"; // Ensure logo import

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-500 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo container */}
        <div className={`flex items-center ${isMenuOpen ? 'hidden' : 'flex'}`}>
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="High Street Gym Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>
        {/* Hamburger menu button */}
        <button
          className="block md:hidden focus:outline-none ml-4"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-between w-full bg-gray-600`}
        >
          <Nav />
        </nav>
      </div>
    </header>
  );
};

export default Header;
