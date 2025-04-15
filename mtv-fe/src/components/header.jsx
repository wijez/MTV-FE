import React, { useState } from 'react';
import avatar from '../assets/avatagit.jpg';

const HeaderPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={`flex justify-between items-center p-4 ${
        darkMode ? 'bg-gray-800' : 'bg-blue-700'
      } z-50`}
    >
      {/* Logo và Tìm kiếm */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 63 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.5 60.75C47.6543 60.75 60.75 47.6543 60.75 31.5C60.75 15.3457 47.6543 2.25 31.5 2.25C15.3457 2.25 2.25 15.3457 2.25 31.5C2.25 47.6543 15.3457 60.75 31.5 60.75Z"
              fill="white"
              stroke="#1259A5"
              strokeWidth="4"
            />
            <path
              d="M18.5 46.25C22.8333 41.9167 27.1667 40.8333 31.5 43C35.8333 40.8333 40.1667 41.9167 44.5 46.25V26.75C40.1667 24.5833 35.8333 24.5833 31.5 26.75C27.1667 24.5833 22.8333 24.5833 18.5 26.75V46.25Z"
              fill="white"
              stroke="#1259A5"
              strokeWidth="2"
            />
            <path
              d="M12 30L31.5 17L51 30"
              stroke="#1259A5"
              strokeWidth="4"
            />
          </svg>
        </div>

        {/* Tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="hidden sm:block p-2 rounded-full border border-gray-300 bg-white text-sm w-40 sm:w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Avatar và Menu */}
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <img
          src={avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleMenu}
        />

        {/* Menu Dropdown */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
            <ul>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Tài khoản</li>
              <li className="p-2 hover:bg-gray-200 cursor-pointer">Đăng xuất</li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={toggleDarkMode}
              >
                {darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              </li>
              <li
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                Thoát
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderPage;