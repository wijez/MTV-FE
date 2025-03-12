// import { LogoNCKH } from '../assets/logoNCKH.svg';
import React from 'react';
import avatar from '../assets/avatagit.jpg';
const HeaderPage = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-blue-700">
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
        <span className="text-2xl sm:text-3xl">🐴</span> {/* Placeholder for the mascot image */}
      </div>
    </header>
    );
}

export default HeaderPage;