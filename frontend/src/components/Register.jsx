import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './NavBar';
import api from '../api/config';

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
      const response = await api.post('/register', formData);
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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-500">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="firstname">
              First Name
            </label>            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="lastname">
              Last Name
            </label>            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              placeholder="Enter your last name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              placeholder="Enter your email"
              required
            />
          </div>          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="role">
              Role
            </label>            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 bg-white"
              required
            >
              <option value="">Select your role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              placeholder="Create a strong password"
              required
            />
          </div>          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create Account
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
      )}      <footer className="bg-green-600 w-full py-6 text-white text-center shadow-lg">
        <div className="container mx-auto">
          <p className="text-lg font-medium">&copy; 2024 CodeArena. All rights reserved.</p>          <p className="mt-2 text-green-100">
            Crafted with passion for coding excellence
          </p>
          <div className="mt-3 text-sm">
            <p>Contact: 8010833596 | Email: ssborse2004@gmail.com</p>
            <p>Made by Sarthak Borse</p>
          </div>
        </div>
      </footer>
      <ToastContainer /> {/* Toast container for displaying notifications */}
    </div>
  );
};

export default Register;
