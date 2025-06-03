import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { API_BASE_URL } from '../api/config';

const ProblemPage = () => {
  const { id } = useParams();
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [tags, setTags] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
    fetchTags();
    fetchDifficulties();
  }, []);

  // Fetching Problems from Backend
  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/problems`);
      setProblems(response.data);
      setLoading(false);
      console.log('Fetched problems:', response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Error fetching problems');
      setLoading(false);
    }
  };

  // Fetching Tags from Backend
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/problems/tags`);
      setTags(response.data);
      console.log('Fetched tags:', response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Fetching Difficulties from Backend
  const fetchDifficulties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/problems/difficulties`);
      setDifficulties(response.data);
      console.log('Fetched difficulties:', response.data);
    } catch (error) {
      console.error('Error fetching difficulties:', error);
    }
  };

  // Filter problems based on selected tag and difficulty
  const filteredProblems = problems.filter((problem) => {
    return (
      (filterTag ? problem.tag === filterTag : true) &&
      (filterDifficulty ? problem.difficulty === filterDifficulty : true)
    );
  });

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
        const user = response.data.user;
        setCurrentUser(response.data.user);
        fetchSolvedProblems(user._id);
        console.log(response.data.user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetching Solved Problems from Backend
  const fetchSolvedProblems = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/solvedProblems`);
      setSolvedProblems(response.data.solvedProblems);
      console.log('Fetched solved problems:', response.data.solvedProblems);
    } catch (error) {
      console.error('Failed to fetch solved problems:', error);
    }
  };

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <NavBar user={currentUser} onLogout={handleLogout} /><header className="bg-green-600 w-full py-6 text-white text-center mb-8 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold tracking-wide">Challenge Arena</h1>
          <p className="mt-2 text-green-100">Test your skills with our curated problems</p>
        </div>
      </header>      <Link
        to={'/submissions'} // Assuming currentUser has the _id of the user
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 transform hover:scale-105 mt-4 inline-block"
      >
        All Submissions
      </Link><div className="container mx-auto">
        <div className="mb-6 flex justify-between bg-white rounded-xl shadow-md p-6">
          {/* Filter by Tag */}
          <div className="flex items-center space-x-3">
            <label className="text-gray-700 font-semibold">Filter by Tag:</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          {/* Filter by Difficulty */}
          <div className="flex items-center space-x-3">
            <label className="text-gray-700 font-semibold">Filter by Difficulty:</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>        <div className="bg-white shadow-xl rounded-xl overflow-hidden">          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-green-500 text-white">                <th className="py-4 px-6 font-bold uppercase text-sm tracking-wide">Problem Name</th>
                <th className="py-4 px-6 font-bold uppercase text-sm tracking-wide">Tag</th>
                <th className="py-4 px-6 font-bold uppercase text-sm tracking-wide">Difficulty</th>
                <th className="py-4 px-6 font-bold uppercase text-sm tracking-wide">Verdict</th>
                <th className="py-4 px-6 font-bold uppercase text-sm tracking-wide">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => {
                const isSolved = solvedProblems.includes(problem._id);                return (
                  <tr key={index} className={`hover:bg-gray-50 transition duration-200 ${isSolved ? 'bg-green-50 border-l-4 border-green-500' : ''}`}>
                    <td className={`py-4 px-6 border-b border-gray-200 ${isSolved ? 'bg-green-50' : ''}`}>
                      <Link to={`/problems/${problem._id}`} className="text-green-600 hover:text-green-800 font-semibold hover:underline transition duration-300">
                        {problem.name}
                      </Link>
                    </td>
                    <td className={`py-4 px-6 border-b border-gray-200 text-center ${isSolved ? 'bg-green-50' : ''}`}>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {problem.tag}
                      </span>
                    </td>
                    <td className={`py-4 px-6 border-b border-gray-200 text-center ${isSolved ? 'bg-green-50' : ''}`}>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                          problem.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : problem.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {problem.difficulty.toUpperCase()}
                      </span>
                    </td>
                    <td className={`py-4 px-6 border-b border-gray-200 text-center ${isSolved ? 'bg-green-50' : ''}`}>
                      <span className={`font-semibold ${isSolved ? 'text-green-600' : 'text-gray-600'}`}>
                        {isSolved ? 'Accepted' : (problem.verdict || 'Not Attempted')}
                      </span>
                    </td>
                    <td className={`py-4 px-6 border-b border-gray-200 text-center font-semibold ${isSolved ? 'bg-green-50' : ''}`}>
                      {problem.submissionPercentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>      <footer className="bg-green-600 w-full py-4 text-white text-center mt-auto shadow-lg">
        <div className="container mx-auto">&copy; 2024 CodeArena. All rights reserved.</div>
        <h3>
        Made by Sarthak Borse
        </h3>
        <div className="mt-2 text-sm">
          <p>Contact: 8010833596 | Email: ssborse2004@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default ProblemPage;
