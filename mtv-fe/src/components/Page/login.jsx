import React from 'react';
// import logoNCKH from '../../assets/logoNCKH';
import LoginForm from '../Form/loginForm';
import backgroundImage from '../../assets/background.png';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center "
    style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center' 
      }}>
      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-4">
        {/* Left Section - School Info */}
        <div className="text-center md:text-left mb-6 md:mb-0 md:mr-10">
          <div className="mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto md:mx-0">
              {/* <logoNCKH /> */}
              <svg width="63" height="63" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M31.5 60.75C47.6543 60.75 60.75 47.6543 60.75 31.5C60.75 15.3457 47.6543 2.25 31.5 2.25C15.3457 2.25 2.25 15.3457 2.25 31.5C2.25 47.6543 15.3457 60.75 31.5 60.75Z" fill="white" stroke="#1259A5" stroke-width="4"/>
              <path d="M18.5 46.25C22.8333 41.9167 27.1667 40.8333 31.5 43C35.8333 40.8333 40.1667 41.9167 44.5 46.25V26.75C40.1667 24.5833 35.8333 24.5833 31.5 26.75C27.1667 24.5833 22.8333 24.5833 18.5 26.75V46.25Z" fill="white" stroke="#1259A5" stroke-width="2"/>
              <path d="M12 30L31.5 17L51 30" stroke="#1259A5" stroke-width="4"/>
              </svg>

            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-2 shadow-indigo-100">
            Quản lý NCKH
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Trường Đại học Kiến trúc Đà Nẵng
          </h2>
        </div>

        {/* Right Section - Login Form */}
        <LoginForm />
        </div>
        </div>
      
  );
};

export default Login;