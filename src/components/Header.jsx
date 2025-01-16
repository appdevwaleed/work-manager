"use client";
import React, { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-white via-blue-500 text-white py-4 shadow-lg z-10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}

        <div className="flex items-center">
          <img
            src="https://images.wayno.ae/insecure/fit/150/92/sm/0/plain/https://runrunuae-assets.s3.me-central-1.amazonaws.com/Clientlogo/66cd80617f1c6.png"
            alt="Your Company"
          />
        </div>

        {/* Mobile Menu Button */}
        {!isMobileMenuOpen && (
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden text-2xl focus:outline-none">
            &#9776; {/* Hamburger icon */}
          </button>
        )}

        {/* Desktop Menu */}

        <nav
          className={`md:flex  md:justify-center md:items-center  sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 ${
            isMobileMenuOpen ? "block" : "hidden"
          } sm:block `}>
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-200">
            About Us
          </Link>
          <Link href="/services" className="hover:text-gray-200">
            Services
          </Link>
          <Link href="/track" className="hover:text-gray-200">
            Track Your Parcel
          </Link>
          <Link href="/contact" className="hover:text-gray-200">
            Contact
          </Link>
          <button onClick={toggleDropdown} className="hover:text-gray-200">
            <span className="text-xl">👤</span> {/* User Icon */}
            <span>Account</span>
          </button>

          <div className="relative">
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                <div className="py-2">
                  <Link
                    href="/pages/login"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setIsDropdownOpen(false)} // Close dropdown after clicking
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/pages/signup"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setIsDropdownOpen(false)} // Close dropdown after clicking
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
