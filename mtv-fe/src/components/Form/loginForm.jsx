import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../../api/api';
import { jwtDecode } from 'jwt-decode';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login({ email, password });
  
      // Lưu token vào localStorage
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
  
      const decodedToken = jwtDecode(data.access);
      console.log('Decoded Token:', decodedToken); 
      const role = decodedToken.role; 

      localStorage.setItem('role', role);
  
      if (role === 'ADMIN') {
        navigate('/home-admin'); 
      } else if (role === 'TEACHER') {
        navigate('/home'); 
      } else {
        setError('Role not recognized'); 
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Web Quản Lý GV
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Tên đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default LoginForm;