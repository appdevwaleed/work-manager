"use client";
import Link from "next/link";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-6">
        {/* Footer Top Section */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-start space-y-6 sm:space-y-0">
          {/* Logo and Description Section */}
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <img
              src="https://your-image-url.com/logo.png"
              alt="Courier Logo"
              className="h-16 mx-auto sm:mx-0"
            />
            <h2 className="text-2xl font-bold mt-2">DeliveryX</h2>
            <p className="text-sm text-gray-400 mt-2">
              Fast, reliable, and trusted delivery services worldwide.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
            <Link href="/" className="hover:text-gray-400">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-400">
              About Us
            </Link>

            <Link href="/contact" className="hover:text-gray-400">
              Contact
            </Link>
          </div>
        </div>

        {/* Footer Middle Section with Important Links */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-start mt-8 space-y-6 sm:space-y-0">
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-lg mb-4">Important Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/privacy-policy" className="hover:text-gray-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-400">
                Terms of Service
              </Link>
              <Link href="/faq" className="hover:text-gray-400">
                FAQs
              </Link>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <address className="text-sm text-gray-400">
              123 Courier St, Delivery City, 12345
              <br />
              Email:{" "}
              <a
                href="mailto:support@deliveryx.com"
                className="hover:text-gray-400">
                support@deliveryx.com
              </a>
              <br />
              Phone:{" "}
              <a href="tel:+1234567890" className="hover:text-gray-400">
                +1 234 567 890
              </a>
            </address>
          </div>
        </div>

        {/* Footer Bottom Section with Social Media and Copyright */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-8">
          {/* Social Media Links */}
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <a
              href="https://facebook.com"
              className="text-xl hover:text-gray-400">
              Facebook
            </a>
            <a
              href="https://twitter.com"
              className="text-xl hover:text-gray-400">
              Twitter
            </a>
            <a
              href="https://instagram.com"
              className="text-xl hover:text-gray-400">
              Instagram
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center">
            <p>&copy; 2025 DeliveryX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
