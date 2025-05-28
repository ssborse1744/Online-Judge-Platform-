import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import NavBar from './NavBar';
const TestCase = () => {
  const { problemId } = useParams();
  const [testCases, setTestCases] = useState([]);
  const [formData, setFormData] = useState({ input: '', output: '' });
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      const response = await axios.get(`https://backend.oj-online-judge.site/problems/${problemId}/testcases`);
      setTestCases(response.data);
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
      await axios.post(`https://backend.oj-online-judge.site/problems/${problemId}/testcases`, formData);
      setMessage('Test case added successfully!');
      setFormData({ input: '', output: '' });
      fetchTestCases();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend.oj-online-judge.site/problems/${problemId}/testcases/${id}`);
      setMessage('Test case deleted successfully!');
      fetchTestCases();
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const toggleTestCaseSelection = (id) => {
    setSelectedTestCases(prevState => {
      if (prevState.includes(id)) {
        return prevState.filter(tcId => tcId !== id);
      } else {
        return [...prevState, id];
      }
    });
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
       <NavBar user={currentUser} onLogout={handleLogout} /> 
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Test Cases</h2>
        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="input">
              Input
            </label>
            <input
              type="text"
              id="input"
              name="input"
              value={formData.input}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="output">
              Output
            </label>
            <input
              type="text"
              id="output"
              name="output"
              value={formData.output}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Add Test Case
          </button>
        </form>
      </div>

      <div className="mt-8 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-center">Existing Test Cases</h3>
        <ul>
          {testCases.map((testCase) => (
            <li key={testCase._id} className="bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center">
              <div>
                <p><strong>Input:</strong> {testCase.input}</p>
                <p><strong>Output:</strong> {testCase.output}</p>
              </div>
              <div>
                <button
                  onClick={() => handleDelete(testCase._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <input
                  type="checkbox"
                  checked={selectedTestCases.includes(testCase._id)}
                  onChange={() => toggleTestCaseSelection(testCase._id)}
                />
              </div>
            </li>
          ))}
        </ul>
        <Link to={`/problems/${problemId}`} className="block text-center mt-4 text-blue-600 hover:text-blue-800">
          Back to Problem
        </Link>
      </div>
    </div>
  );
};

export default TestCase;
