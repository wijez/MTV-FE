import React, { useState } from 'react';
import avatar from '../assets/avatagit.jpg';
import { CiSearch } from "react-icons/ci";
import { LuBellRing } from "react-icons/lu";
import { CgMail } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import Profile from './Common/Profile'; 

const HeaderAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Bạn có muốn thoát hay không?');
    if (confirmLogout) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('role');

      // navigate('/');
      window.location.href = '/';; 
    }
  };

  return (
    <header
      className={`flex justify-between items-center p-4 px-10 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } z-50`}
    >
      {/* Logo và Tìm kiếm */}
      <div className="flex items-center space-x-4 w-[300px]">
        <div className="flex items-center justify-center border w-full border-[#d5d5d5] rounded-full p-2 bg-[#f5f6fa] text-sm">
          <CiSearch className="w-10 h-5 font-bold text-[#3a3939]" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="outline-none text-gray-500 h-full w-full"
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-10 text-blue-700 text-xl cursor-pointer">
          <LuBellRing />
        </div>
        <div className="w-10 text-blue-700 text-2xl cursor-pointer">
          <CgMail />
        </div>

        {/* Avatar và Menu */}
        <div className="flex items-center">
          <img
            src={avatar}
            alt="Avatar"
            className="w-7 h-7 rounded-full cursor-pointer"
            onClick={toggleMenu}
          />

          {/* Menu Dropdown */}
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
              <ul>
                <li
                  className="p-2 hover:text-blue-500 cursor-pointer"
                  onClick={() => {
                    setShowProfile(true); 
                    setMenuOpen(false); 
                  }}
                >
                  Tài khoản
                </li>
                <li
                  className="p-2 hover:text-blue-500 cursor-pointer"
                  onClick={handleLogout} // Gọi hàm xử lý đăng xuất
                >
                  Đăng xuất
                </li>
                <li
                  className="p-2 hover:text-blue-500 cursor-pointer"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                </li>
                <li
                  className="p-2 hover:text-blue-500 cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  Thoát
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị dialog Profile */}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </header>
  );
};

export default HeaderAdmin;