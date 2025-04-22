import React, { useEffect, useState } from 'react'
import avatar from '../../assets/avatagit.jpg';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../../api/api';

export default function InfoUser() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMe = async () => {
      const data = await fetchMe();
      setUser(data);
    };
    getMe();
  }, []);

  const handleClick = () => {
    navigate('/details');
  };

  return (
    <div className="flex flex-col md:flex-row items-center p-4 bg-white shadow-lg rounded-lg w-full h-full mx-auto md:p-10">
      <img
        className="w-40 h-40 rounded-full md:mr-4 mb-4 md:mb-0"
        src={user?.profile?.avatar ? user.profile.avatar : avatar}
        alt="User Avatar"
      />
      <div className="text-center md:text-left md:ml-4">
        <h3 className="text-3xl font-extrabold">{user?.full_name || '---'}</h3>
        <p className="text-gray-600">{user?.profile?.degree || ''}</p>
        <p className="text-gray-600">{user?.profile?.department || ''}</p>
        <p className="text-gray-600">{user?.profile?.country || ''}</p>
        <p className="text-gray-600">{user?.profile?.address || ''}</p>
        <button className="mt-2 text-blue-500 hover:underline" onClick={handleClick}>
          Chi tiết
        </button>
      </div>
    </div>
  );
}
