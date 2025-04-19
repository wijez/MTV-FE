import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import UndefineImage from '../../assets/undefine.png';

export default function Profile({ onClose }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('access');

        const response = await api.get('/user/read_me/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserDetails(response.data); 
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        toast.error('Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <p className="text-gray-700 text-center">Đang tải thông tin...</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <p className="text-gray-700 text-center">Không thể tải thông tin người dùng.</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <div className="flex justify-center mb-2">
        <img
          className="w-40 h-40 rounded-full object-cover"
          src={userDetails.profile.avatar || UndefineImage}
          alt="Avatar"
        />
      </div>
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
            
          <p className="text-sm text-gray-600">
            <strong>Tên:</strong> {userDetails.full_name || 'Không có thông tin'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {userDetails.email || 'Không có thông tin'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Số điện thoại:</strong> {userDetails.phone || 'Không có thông tin'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Vai trò:</strong> {userDetails.role || 'Không có thông tin'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Học vị:</strong> {userDetails.profile.degree || 'Không có thông tin'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Ngày tạo:</strong>{' '}
            {new Date(userDetails.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}