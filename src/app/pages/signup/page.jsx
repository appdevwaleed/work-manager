"use client";
// components/SignUp.js

import React, { useState } from "react";
import Link from "next/link";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      username: "",
      email: "",
      password: "",
    });

    // Validation
    let formIsValid = true;
    let newErrors = { ...errors };
    // Username validation
    if (!!formData.username.trim() == "") {
      formIsValid = false;
      newErrors.username = "Username is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      formIsValid = false;
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      formIsValid = false;
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      formIsValid = false;
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[0-9]/.test(formData.password)) {
      formIsValid = false;
      newErrors.password = "Password must contain at least one number";
    } else if (!/[A-Za-z]/.test(formData.password)) {
      formIsValid = false;
      newErrors.password = "Password must contain at least one letter";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      formIsValid = false;
      newErrors.password =
        "Password must contain at least one special character";
    }

    setErrors(newErrors);

    if (formIsValid) {
      console.log(formData); // Form submission logic goes here (e.g., API call)
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bo-opacity-100 pt-0"
      style={{ backgroundImage: "url(/backImage.png)" }}>
      <div className="absolute inset-0 bg-blue-500 opacity-15"></div>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative z-5 shadow-1xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-bold text-black">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {!!errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-black">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-black">
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/pages/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
