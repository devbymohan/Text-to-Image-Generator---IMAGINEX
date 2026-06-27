import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { setShowLogin, user, creditBalance, logout } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-4 px-4 sm:px-8">
      {/* Logo */}
      <Link to="/">
        <img className="w-28 sm:w-32 lg:w-40" src={assets.logo} alt="Logo" />
      </Link>

      {/* Right section */}
      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4 relative">
            {/* Credits button */}
            <button
              onClick={() => navigate('/buy')}
              className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-300"
            >
              <img className="w-5" src={assets.credit_star} alt="Credits" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Credits left: {creditBalance ?? 1}
              </p>
            </button>

            {/* User greeting */}
            <p className="text-gray-600 max-sm:hidden pl-4">Hi, {user.name}</p>

            {/* Profile dropdown */}
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full cursor-pointer drop-shadow"
                src={assets.profile_icon}
                alt="Profile"
              />
              <div className="absolute right-0 mt-2 hidden group-hover:block">
                <ul className="bg-white border rounded-md shadow-lg text-sm">
                  <li
                    onClick={logout}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p
              onClick={() => navigate('/buy')}
              className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-zinc-800 text-white px-6 sm:px-10 py-2 sm:py-2 text-sm rounded-full hover:bg-zinc-900 transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;