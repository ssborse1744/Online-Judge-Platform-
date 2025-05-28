import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://backend.oj-online-judge.site/users/${id}`);
        setUser(response.data);
        setEditedUser(response.data);
      } catch (error) {
        console.error(error);
        setMessage('An error occurred while fetching user data.');
      }
    };

    fetchUser();
  }, [id]);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('firstname', editedUser.firstname);
      formData.append('lastname', editedUser.lastname);
      formData.append('email', editedUser.email);
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }

      const response = await axios.put(`https://backend.oj-online-judge.site/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while updating profile.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://backend.oj-online-judge.site/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar user={currentUser} onLogout={handleLogout} />
      <header className="bg-blue-600 py-4 text-white text-center mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
      </header>
      <div className="container mx-auto p-4">
        {message && <p className="text-red-600">{message}</p>}
        {user && (
          <div className="bg-white p-8 rounded shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={user.profilePhoto || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-4"
              />
              <h2 className="text-3xl font-bold">{user.username}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Personal Info</h3>
                {!isEditing ? (
                  <>
                    <p className="text-lg">
                      <strong>First Name:</strong> {user.firstname}
                    </p>
                    <p className="text-lg">
                      <strong>Last Name:</strong> {user.lastname}
                    </p>
                    <p className="text-lg">
                      <strong>Role :</strong> {user.role}
                    </p>
                    <p className="text-lg">
                      <strong>Email:</strong> {user.email}
                    </p>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      name="firstname"
                      value={editedUser.firstname}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <input
                      type="text"
                      name="lastname"
                      value={editedUser.lastname}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleFileChange}
                      className="w-full border rounded p-2 mb-2"
                    />
                  </>
                )}
              </div>
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Statistics</h3>
                <p className="text-lg">
                  <strong>Questions Solved:</strong> {user.solvedProblems.length}
                </p>
              </div>
              <div className="col-span-1">
                <h3 className="text-xl font-semibold mb-2">Badges</h3>
                <p className="text-lg">
                  <strong>Badges:</strong> {user.badges ? user.badges.join(', ') : 'None'}
                </p>
              </div>
            </div>
            {/* <div className="mb-8">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div> */}
          </div>
        )}
        {user && user.solvedProblems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Solved Problems</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.solvedProblems.map((problemId) => (
                <li key={problemId} className="bg-white rounded-lg shadow-md p-4">
                  <Link
                    to={`/problems/${problemId}`}
                    className="text-blue-600 hover:underline"
                  >
                    Problem ID: {problemId}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
