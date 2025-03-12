// import { LogoNCKH } from '../assets/logoNCKH.svg';
import React, { useState }  from 'react';
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
        <header className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-700'}`}>
      <div className="flex items-center">
        {/* <LogoNCKH className="h-8 w-8 sm:h-10 sm:w-10" /> */}
        <div className="flex items-center">
          <img className="h-8 w-8 sm:h-10 sm:w-10" src={avatar} alt="logo" />
        </div>
        <input
          type="text"
          placeholder="tìm kiếm..."
          className="ml-2 p-2 rounded-3xl border-2 border-gray-800 bg-amber-50
          text-sm sm:text-base md:text-lg
                     w-32 sm:w-48 md:w-64 lg:w-80
                     focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="flex items-center">
        <span className="text-2xl sm:text-3xl" onClick={toggleMenu}>🐴</span> {/* Placeholder for the mascot image */}
      </div>
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
          <ul>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">Account</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">Logout</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={()=> setMenuOpen(false)}>Exit</li>
          </ul>
        </div>
      )}
    </header>
    );
}

export default HeaderPage;