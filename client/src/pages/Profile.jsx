// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
//import bcryptjs from 'bcryptjs'

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  const getCookie = async () => {
    const token = await fetch('/api/csrf-token');
    return token.json()
};

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = await getCookie();
    try {
      dispatch(updateUserStart());

      //formData.password = bcryptjs.hashSync(formData.password, 10);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'x-csrf-token': csrfToken.csrfToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        StatusAlertService.showError(data.message);
        dispatch(updateUserFailure(data));
      } else {
        StatusAlertService.showSuccess("Account Updated Sucessfully");
        dispatch(updateUserSuccess(data));
      }
    } catch (error) {
      StatusAlertService.showError(error);
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const csrfToken = await getCookie();
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'x-csrf-token': csrfToken.csrfToken,
        },
      });
      const data = await res.json();
      if (data.success === false) {
        StatusAlertService.showError(data.message);
        dispatch(deleteUserFailure(data));
        return;
      }
      StatusAlertService.showSuccess("User Profile Deleted Successfully");
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      StatusAlertService.showError(error);
      dispatch(deleteUserFailure(error));
    }
  };
   const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      StatusAlertService.showError(error);
      console.log(error);
    }
  };

  return (
    <div>
      <StatusAlert />
      <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
          Your Profile
        <form onSubmit={handleSubmit} className="signup-form d-flex flex-column">
          <div className="mb-4">
            <input
              type="text"
              id="username"
              placeholder="Username"
              defaultValue={currentUser.username}
              className="form-input"
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              placeholder="Email"
              defaultValue={currentUser.email}
              className="form-input"
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="form-input"
              onChange={handleOnChange}
            />
          </div>
          {/* button for update with hover animation */}
          <button
            type="submit"
            className="signup-btn mx-auto my-auto"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between">
          {/* delete account with hover animation */}
          <button
            onClick={handleDeleteAccount}
            className="delete-btn"
          >
            Delete Account
          </button>

          {/* logout with hover animation */}
          <button
            onClick={handleSignOut}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}