// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
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

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
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
    <div className="min-h-screen flex flex-col bg-gray-100">
       <NavBar user={currentUser} onLogout={handleLogout} />
      {/* <header className="bg-blue-700 w-full py-4 flex justify-between items-center px-4">
        <h1 className="text-white text-3xl font-bold hover:text-yellow-300 transition duration-300 ease-in-out">
          <Link to="/">Online Judge</Link>
        </h1>
        <nav className="space-x-4 flex items-center">
          <Link to="/ManageProblems" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out">Manage Problems</Link>
        </nav>
      </header> */}      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl font-bold text-green-600 mb-6">CodeArena</h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Your gateway to competitive programming excellence
          </p>          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Practice coding problems, improve your algorithms, and prepare for technical interviews 
            with our comprehensive online judge platform.
          </p>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Practice Problems</h3>
            <p className="text-gray-600">
              Solve carefully curated problems across various difficulty levels and topics.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Instant Feedback</h3>
            <p className="text-gray-600">
              Get real-time evaluation of your code with detailed test case results.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement with detailed statistics and performance analytics.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Join Our Community</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600">Coding Problems</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600">Platform Availability</p>
            </div>
          </div>
        </section>
      </main>      <footer className="bg-green-600 text-white text-center py-8 shadow-lg">
        <div className="container mx-auto">
          <p className="text-lg font-medium">&copy; 2024 CodeArena. All rights reserved.</p>
          <div className="mt-4 text-sm">
            <p>Contact: 8010833596 | Email: ssborse2004@gmail.com</p>
            <p className="mt-1">Made by Sarthak Borse</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
