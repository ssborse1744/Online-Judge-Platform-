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

        const response = await axios.get('https://backend.oj-online-judge.site/api/auth/me', {
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
      const response = await axios.post('https://backend.oj-online-judge.site/login', formData);
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
      await axios.post('https://backend.oj-online-judge.site/api/auth/logout', {}, {
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
      </header> */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
              <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
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
      )}
      <footer className="bg-blue-600 w-full py-4 text-white text-center">
        <div className="container mx-auto">
          &copy; 2024 Online Judge. All rights reserved.
          <h3>
        Made with ❤ by Pranav Sarate
        </h3>
        </div>
      </footer>
    </div>
  );
};

export default Login;
