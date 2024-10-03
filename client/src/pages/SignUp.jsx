// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
//import bcryptjs from 'bcryptjs'

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      //formData.password = bcryptjs.hashSync(formData.password, 10);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign up failed");
      }

      setFormData({});
      setLoading(false);
      // Redirect to the signin page
      navigate("/signin");
    } catch (err) {
      setLoading(false);

      // Check if the error message contains the duplicate key error
      if (err.message.includes("duplicate key error collection")) {
        // Show a specific error message for duplicate username
        StatusAlertService.showError(
          "The username you entered is already in use. Please choose a different username."
        );
      } else {
        // Show a generic error message for other errors
        StatusAlertService.showError(
          err.message || "Sign up failed. Please try again."
        );
      }
    }
  };

  return (
    <div>
      <StatusAlert />
      <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
        Sign Up
        <form
          onSubmit={handleSubmit}
          className="signup-form d-flex flex-column"
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 text-sm mb-2"
            >
              Username
            </label>
            <input
              className="form-input"
              type="text"
              id="username"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-600 text-sm mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your password again"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
