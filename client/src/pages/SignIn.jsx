// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
//import bcryptjs from 'bcryptjs'

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      //formData.password = bcryptjs.hashSync(formData.password, 10);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data));
        return StatusAlertService.showError(
          data.message || "Signin failed. Please try again."
        );
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
      // Check if the error message contains the duplicate key error
      if (error.message.includes("duplicate key error collection")) {
        StatusAlertService.showError(
          "The username you entered is already in use. Please choose a different username."
        );
        // Show a specific error message for duplicate username
      } else if (error.message.includes("user not found !")) {
        StatusAlertService.showError(
          "The account was not found. Try signing up first."
        );
      } else {
        // Show a generic error message for other errors
        StatusAlertService.showError(error.message);
      }
    }
  };

  return (
    <div>
      <StatusAlert />
      <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
        Sign In
        <form
          onSubmit={handleSubmit}
          className="signup-form d-flex flex-column"
        >
          {/* --------------------email-------------------- */}
          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            value={formData.email || ""}
            placeholder="youremail@gmail.com"
            name="email"
            type="email"
            onChange={handleChange}
          />

          {/* -------------------- password-------------------- */}
          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            value={formData.password || ""}
            placeholder="********"
            name="password"
            type="password"
            onChange={handleChange}
          />

          {/* --------------------login btn-------------------- */}
          <div className="btn-div">
            <button
              disabled={!(formData.email && formData.password)}
              className="signup-btn mx-auto my-auto"
            >
              {loading ? "Signing in" : "Sign In"}
            </button>
          </div>
          {/* --------------------signup link-------------------- */}
          <p className="link-btn">
            New to HealthFitness? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
