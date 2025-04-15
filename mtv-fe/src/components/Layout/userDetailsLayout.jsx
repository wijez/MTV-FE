import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserDetailsLayout() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/read_me/'); 
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu người dùng.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-yellow-500 text-6xl mb-4">⏳</div>
        <p className="text-gray-500 text-lg text-center">Đang tải dữ liệu người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin người dùng</h1>
      <p><strong>Họ và tên:</strong> {userData.full_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Vai trò:</strong> {userData.role}</p>
      <p><strong>Ngày tham gia:</strong> {new Date(userData.date_joined).toLocaleDateString('vi-VN')}</p>
      <p><strong>Học vị:</strong> {userData.profile.degree}</p>
      <p><strong>Khoa:</strong> {userData.profile.department}</p>
      <p><strong>Quốc gia:</strong> {userData.profile.country || 'Chưa cập nhật'}</p>
      <p><strong>Địa chỉ:</strong> {userData.profile.address || 'Chưa cập nhật'}</p>
      <p><strong>Dân tộc:</strong> {userData.profile.nation || 'Chưa cập nhật'}</p>
      <p><strong>Quốc tịch:</strong> {userData.profile.nationality || 'Chưa cập nhật'}</p>
      <p><strong>Tôn giáo:</strong> {userData.profile.religion || 'Chưa cập nhật'}</p>
    </div>
  );
}