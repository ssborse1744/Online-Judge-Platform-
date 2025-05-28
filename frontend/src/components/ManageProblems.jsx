import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HomeButton from './HomeButton';
import NavBar from './NavBar';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '', // Added 'tag' field to formData
    difficulty: 'easy',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, selectedDifficulty]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('https://backend.oj-online-judge.site/problems');
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
        await axios.put(`https://backend.oj-online-judge.site/problems/${editingId}`, formData);
        setMessage('Problem updated successfully!');
      } else {
        await axios.post('https://backend.oj-online-judge.site/problems', formData);
        setMessage('Problem added successfully!');
      }
      setFormData({ name: '', description: '', tag: '', difficulty: 'easy' }); // Reset 'tag' to empty string after submission
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
      await axios.delete(`https://backend.oj-online-judge.site/problems/${id}`);
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

  
  const [currentUser, setCurrentUser] = useState(null);
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
       <NavBar user={currentUser} onLogout={handleLogout} /> 
      <header className="bg-blue-600 w-full py-4 text-white text-center shadow-md">
        <div className="container mx-auto">
          <div className="text-3xl font-bold hover:text-yellow-300 transition duration-300 ease-in-out">
            <Link to="/">Online Judge</Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-8 flex flex-wrap">
        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Add / Edit Problem</h2>
            {message && <p className="mb-4 text-center text-green-600">{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  required
                  placeholder="Enter problem description here..."
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="tag">Tag</label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out">
                {editingId ? 'Update Problem' : 'Add Problem'}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-2/3 px-4 mb-8">
          <div className="bg-white p-8 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-600">Existing Problems</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="difficulty-filter">Filter by Difficulty</label>
              <select
                id="difficulty-filter"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <ul>
              {filteredProblems.map((problem) => (
                <li key={problem._id} className="bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center hover:shadow-lg transition duration-300 ease-in-out">
                  <div>
                    <h4 className="text-lg font-bold text-blue-600">{problem.name}</h4>
                    <p className="text-base text-gray-700 mb-4 whitespace-pre-wrap">{problem.description}</p>
                    <p className={`inline-block px-2 py-1 rounded mt-2 ${
                      problem.difficulty === 'easy' ? 'bg-green-200 text-green-800' : 
                      problem.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(problem)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/testcases/${problem._id}`}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
                    >
                      Manage Test Cases
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
