// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { updateUserStart, updateUserSuccess, updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOut } from "../redux/user/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess]=useState(false)


  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
      } else {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true)
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
      navigate("/");
      
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-md shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-extrabold text-center mb-6 text-blue-600'>
          Your Profile
        </h1>
        <form onSubmit={handleSubmit} className='mb-8'>
          <div className='mb-4'>
            <input
              type='text'
              id='username'
              placeholder='Username'
              defaultValue={currentUser.username}
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              onChange={handleOnChange}
            />
          </div>
          <div className='mb-4'>
            <input
              type='email'
              id='email'
              placeholder='Email'
              defaultValue={currentUser.email}
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              onChange={handleOnChange}
            />
          </div>
          <div className='mb-4'>
            <input
              type='password'
              id='password'
              placeholder='Password'
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500'
              onChange={handleOnChange}
            />
          </div>
          {/* button for update with hover animation */}
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 transition duration-300'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        <div className='flex justify-between'>

          {/* delete account with hover animation */}
          <span onClick={handleDeleteAccount} className='text-red-500 cursor-pointer hover:underline'>
            Delete Account
          </span>

          {/* logout with hover animation */}
          <span  onClick={handleSignOut} className='text-blue-500 cursor-pointer hover:underline'>
            Logout
          </span>
        </div>
          <p className="text-green-700 mt-5">
        {error && "somthing went wrong" }
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully " }
      </p>
      </div>
    
    </div>
  );
}
