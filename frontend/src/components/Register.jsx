import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './NavBar';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    password: '',
  });

  const [showPopup, setShowPopup] = useState(false);
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
      const response = await axios.post('https://backend.oj-online-judge.site/register', formData);
      toast.success(response.data.message); // Show success message
      if (response.data.user) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/login');
        }, 3000); // Hide popup and redirect after 3 seconds
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response.data.error); // Show error message
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <NavBar></NavBar>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="firstname">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="role">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center text-green-600">
              Registration successful! Redirecting...
            </p>
          </div>
        </div>
      )}
      <footer className="bg-blue-600 w-full py-4 text-white text-center">
        <div className="container mx-auto">
          &copy; 2024 Online Judge. All rights reserved.
          <h3>
        Made with ❤ by Pranav Sarate
        </h3>
        </div>
      </footer>
      <ToastContainer /> {/* Toast container for displaying notifications */}
    </div>
  );
};

export default Register;
