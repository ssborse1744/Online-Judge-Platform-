import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import CodeModal from './CodeModal';
import { API_BASE_URL } from '../api/config';

const SubmissionsPage = () => {
  const { id } = useParams(); // Assuming id is the userId or problemId, adjust as needed
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/submissions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Error fetching submissions. Please try again later.');
      setLoading(false);
    }
  };

  const openModal = (code) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCode('');
  };

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

  const ClickableCode = ({ to, children }) => {
    return (
      <Link to={to} className="text-blue-500 hover:underline cursor-pointer">
        {children}
      </Link>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <NavBar user={currentUser} onLogout={handleLogout} />      <header className="bg-green-600 w-full py-4 text-white text-center mb-8 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">My Submissions</h1>
        </div>
      </header>
      <div className="container mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Submission ID</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">User</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Problem Name</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Your Code</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Verdict</th>
                <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((submission) => (
                <tr key={submission._id} onClick={() => openModal(submission.solution)} className="cursor-pointer hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-center">{submission._id}</td>
                  <td className="py-2 px-4 border-b text-center">{submission.userId.email}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <Link to={`/problems/${submission.problemId._id}`} className="text-blue-500 hover:underline ">
                      {submission.problemId.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b truncate text-center">
                    <ClickableCode>code</ClickableCode>
                  </td>

                  <td className={`py-2 px-4 border-b text-center ${submission.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>{submission.verdict}</td>
                  <td className="py-2 px-4 border-b text-center">{new Date(submission.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>      </div>      <footer className="bg-green-600 w-full py-4 text-white text-center mt-auto shadow-lg">
        <div className="container mx-auto">
          <p className="text-lg font-medium">&copy; 2024 CodeArena. All rights reserved.</p>
          <p className="mt-2 text-green-100">Made by Sarthak Borse</p>
          <div className="mt-3 text-sm">
            <p>Contact: 8010833596 | Email: ssborse2004@gmail.com</p>
          </div>
        </div>
      </footer>
      <CodeModal isOpen={isModalOpen} onRequestClose={closeModal} code={selectedCode} />
    </div>
  );
};

export default SubmissionsPage;
