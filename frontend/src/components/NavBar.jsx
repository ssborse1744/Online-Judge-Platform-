import React from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../assets/profile.png';

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 w-full py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <h1 className="text-white text-3xl font-bold">
          <Link to="/" className="hover:text-yellow-300 transition duration-300 ease-in-out">
            Online Judge
          </Link>
        </h1>

        {/* Menu Items */}
        <ul className="flex space-x-4">
          {user && (
            <li>
              <Link to="/problems" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out">
                Problems
              </Link>
            </li>
          )}

          {user && user.role === 'admin' && (
            <li>
              <Link
                to="/ManageProblems"
                className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
              >
                Manage Problems
              </Link>
            </li>
          )}
          {!user && (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-yellow-300 transition duration-300 ease-in-out">
                 Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* User Actions */}
        {user && (
          <div className="flex items-center space-x-4">
            <Link
              to={`/users/${user._id}/profile`}
              className="text-white flex items-center hover:text-yellow-300 transition duration-300 ease-in-out"
            >
              <img
                src={profileIcon}
                alt="Profile Icon"
                className="w-8 h-8 rounded-full object-cover"
                style={{ maxWidth: '32px' }} // Adjust size as needed
              />
              <span className="ml-2 hidden md:inline-block text-white">
                {user.firstname} {user.lastname}
              </span>
            </Link>
            <button
              onClick={onLogout}
              className="text-white bg-red-600 hover:bg-red-700 font-bold py-1 px-3 rounded transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
