import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const loginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Hook for navigation
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
    
        try {
          // tạo API để yêu cầu đăng nhập
          const response = await axios.post('http://localhost:8000/user/auth/login/', {
              email: email,
              password: password,
          });
    
          const data = await response.data;
    
          if (response.status === 200) {
            // Successful login
            console.log('Login successful:', data);
            // lưu token vào localStorage
            localStorage.setItem('token', data.token); 
            // chuyển hướng đến trang chủ
            navigate('/Home');
          } else {
            setError(data.message || 'Invalid email or password');
          }
        } catch (err) {
          console.error('Error during login:', err);
          setError('Something went wrong. Please try again later.');
        }
      };
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Web Quản Lý GV
        </h3>
        <form  onSubmit={handleSubmit}>
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
    
    )
}
export default loginForm;