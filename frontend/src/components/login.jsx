import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './NavBar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5050/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/login', formData);
      if (response.data.message) {
        toast.success(response.data.message);
      }
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        console.log('Login response:', response); // Add this line to log the response
        setCurrentUser(response.data.user);
        console.log(response.data.user);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          if (response.data && response.data.user) {
            navigate('/');
          } else {
            console.error('User data is not available in the response');
            // Handle the case where user data is not present
          }
        }, 3000);
      }
    } catch (error) {
      toast.error('An error occurred during login. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5050/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <ToastContainer />
      <NavBar user={currentUser} onLogout={handleLogout} />
      {/* <header className="bg-blue-600 w-full py-4 text-white text-center">
        <div className="container mx-auto">
          <div className="text-3xl font-bold">
            <Link to="/">Online Judge</Link>
          </div>
        </div>
      </header> */}      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-green-500">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🔐 Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Sign In
              </button>
              <Link to="/register" className="inline-block align-baseline font-semibold text-sm text-green-600 hover:text-green-800 transition duration-300">
                Register
              </Link>
            </div>
          </form>
        </div>
      </main>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center text-green-600">Login successful! Redirecting...</p>
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
    </div>
  );
};

export default Login;
