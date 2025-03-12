import React from 'react';
// import logoNCKH from '../../assets/logoNCKH';
import LoginForm from '../Form/loginForm';
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-4">
        {/* Left Section - School Info */}
        <div className="text-center md:text-left mb-6 md:mb-0 md:mr-10">
          <div className="mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto md:mx-0">
              {/* <logoNCKH /> */}
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-black-600">
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