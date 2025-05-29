import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/login'; // Ensure the file name matches the case
import ProblemPage from './components/ProblemPage';
import ProblemDetailsPage from './components/ProblemDetailsPage';
import ManageProblems from './components/ManageProblems';
import TestCase from './components/testcases'; // Ensure the file name matches the case
import ProfilePage from './components/ProfilePage';
import NavBar from './components/NavBar';
import AllSubmissions from './components/AllSubmissionPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};


function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
        setCurrentUser(null); // Ensure currentUser is null if there's an error
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5050/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      localStorage.removeItem('token');
      setCurrentUser(null); // Reset currentUser state upon logout
    } catch (error) {
      console.error('Failed to logout:', error);
      
    }
  };

  return (
    <BrowserRouter>
    <div>
    {/* <NavBar user={currentUser} onLogout={handleLogout} /> Add NavBar here */}
    </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/* Pass setCurrentUser to Login component */}
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/problems" element={<ProblemPage />} />
        {/* Example of protected route */}
        <Route path="/ManageProblems" element={currentUser && currentUser.role === 'admin' ? <ManageProblems /> : <Navigate to="/ManageProblems" />} />
        <Route path="/testcases/:problemId" element={<TestCase />} />
        <Route path="/problems/:problemId" element={currentUser  && <ProblemDetailsPage />} />
        <Route path="/users/:id/profile" element={<ProfilePage />} />
        <Route path="/submissions" element={<AllSubmissions />} />
        <Route
          path="/problems"
          element={
            <PrivateRoute>
              <ProblemPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
