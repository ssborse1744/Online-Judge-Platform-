// HomeButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';


const HomeButton = () => {
  return (
    <div className="screen flex flex-col">
      <header className="bg-blue-500 text-white">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold">
            <Link to="/">Online Judge</Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomeButton;