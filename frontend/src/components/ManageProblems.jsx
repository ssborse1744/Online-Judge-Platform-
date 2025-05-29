import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import HomeButton from './HomeButton';
import NavBar from './NavBar';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '',
    difficulty: 'easy',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, selectedDifficulty]);

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

  const fetchProblems = async () => {
    try {
      const response = await axios.get('http://localhost:5050/problems');
      setProblems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`http://localhost:5050/problems/${editingId}`, formData);
        setMessage('Problem updated successfully!');
      } else {
        await axios.post('http://localhost:5050/problems', formData);
        setMessage('Problem added successfully!');
      }
      setFormData({ name: '', description: '', tag: '', difficulty: 'easy' });
      setEditingId(null);
      fetchProblems();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleEdit = (problem) => {
    setFormData({
      name: problem.name,
      description: problem.description,
      tag: problem.tag,
      difficulty: problem.difficulty,
    });
    setEditingId(problem._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/problems/${id}`);
      setMessage('Problem deleted successfully!');
      fetchProblems();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const filterProblems = () => {
    if (selectedDifficulty === 'all') {
      setFilteredProblems(problems);
    } else {
      setFilteredProblems(problems.filter(problem => problem.difficulty === selectedDifficulty));
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <NavBar user={currentUser} onLogout={handleLogout} />
      
      <header className="bg-green-600 w-full py-6 text-white text-center shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold tracking-wide">Admin Panel</h1>
          <p className="mt-2 text-green-100">Manage problems and test cases</p>
        </div>
      </header>

      <div className="container mx-auto mt-8 flex flex-wrap px-4">        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Add / Edit Problem</h2>
            {message && <p className="mb-4 text-center text-green-600 font-semibold bg-green-50 p-3 rounded-lg">{message}</p>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 resize-none"
                  required
                  placeholder="Enter problem description here..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="tag">Tag</label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
                <button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              >
                {editingId ? 'Update Problem' : 'Add Problem'}
              </button>
            </form>
          </div>
        </div>        <div className="w-full md:w-1/2 lg:w-2/3 px-4 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-green-600">Existing Problems</h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="difficulty-filter">Filter by Difficulty</label>
              <select
                id="difficulty-filter"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredProblems.map((problem) => (
                <div key={problem._id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-gray-200">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-green-600 mb-2">{problem.name}</h4>
                    <p className="text-gray-700 mb-3 line-clamp-3">{problem.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                        {problem.tag}
                      </span>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        problem.difficulty === 'easy' 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : problem.difficulty === 'medium' 
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}>
                        {problem.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(problem)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
                    >
                      Delete
                    </button>                    <Link
                      to={`/testcases/${problem._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 inline-block"
                    >
                      Manage Test Cases
                    </Link>
                  </div>
                </div>
              ))}
            </div>          </div>
        </div>
      </div>
      
      <footer className="bg-green-600 w-full py-4 text-white text-center mt-auto shadow-lg">
        <div className="container mx-auto">
          <p className="text-lg font-medium">&copy; 2024 CodeArena. All rights reserved.</p>
          <p className="mt-2 text-green-100">Made by Sarthak Borse</p>
          <div className="mt-3 text-sm">
            <p>Contact: 8010833596 | Email: ssborse2004@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Problems;
