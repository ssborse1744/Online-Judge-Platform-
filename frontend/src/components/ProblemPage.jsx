import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';

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
      const response = await axios.get('https://backend.oj-online-judge.site/problems');
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
      const response = await axios.get('https://backend.oj-online-judge.site/api/problems/tags');
      setTags(response.data);
      console.log('Fetched tags:', response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Fetching Difficulties from Backend
  const fetchDifficulties = async () => {
    try {
      const response = await axios.get('https://backend.oj-online-judge.site/api/problems/difficulties');
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

        const response = await axios.get('https://backend.oj-online-judge.site/api/auth/me', {
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
      const response = await axios.get(`https://backend.oj-online-judge.site/api/users/${userId}/solvedProblems`);
      setSolvedProblems(response.data.solvedProblems);
      console.log('Fetched solved problems:', response.data.solvedProblems);
    } catch (error) {
      console.error('Failed to fetch solved problems:', error);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <NavBar user={currentUser} onLogout={handleLogout} />
      <header className="bg-blue-600 w-full py-4 text-white text-center mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Online Judge Problems</h1>
        </div>
      </header>
      <Link
        to={'/submissions'} // Assuming currentUser has the _id of the user
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 inline-block"
      >
        All Submissions
      </Link>
      <div className="container mx-auto">
        <div className="mb-4 flex justify-between">
          {/* Filter by Tag */}
          <div>
            <label className="mr-2">Filter by Tag:</label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          {/* Filter by Difficulty */}
          <div>
            <label className="mr-2">Filter by Difficulty:</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Problem Name</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Tag</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Difficulty</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Verdict</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Submission %</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => {
                const isSolved = solvedProblems.includes(problem._id);
                return (
                  <tr key={index} className={isSolved ? 'bg-green-100' : ''}>
                    <td className={`py-2 px-4 border-b  ${isSolved ? 'bg-green-100' : ''}`}>
                      <Link to={`/problems/${problem._id}`} className="text-blue-600 hover:underline">
                        {problem.name}
                      </Link>
                    </td>
                    <td className={`py-2 px-4 border-b text-center ${isSolved ? 'bg-green-100' : ''}`}>{problem.tag}</td>
                    <td className={`py-2 px-4 border-b text-center ${isSolved ? 'bg-green-100' : ''}`}>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          problem.difficulty === 'easy'
                            ? 'bg-green-200 text-green-800'
                            : problem.difficulty === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className={`py-2 px-4 border-b text-center ${isSolved ? 'bg-green-100' : ''}`}>
                      <a className="text-black-600">
                        {isSolved ? 'Accepted' : problem.verdict}
                      </a>
                    </td>
                    <td className={`py-2 px-4 border-b text-center ${isSolved ? 'bg-green-100' : ''}`}>{problem.submissionPercentage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="bg-blue-600 w-full py-4 text-white text-center mt-auto">
        <div className="container mx-auto">&copy; 2024 Online Judge. All rights reserved.</div>
        <h3>
        Made with ❤ by Pranav Sarate
        </h3>
      </footer>
    </div>
  );
};

export default ProblemPage;
