import React, { useState } from 'react';
import { createUser } from '../../api/api'; // Import API tạo tài khoản

export default function CreateAccount({ onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'TEACHER',
    is_active: false,
    profile: {
      degree: '',
      department: '',
      country: '',
      address: '',
      nation: '',
      nationality: '',
      religion: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      console.log('User created successfully:', response);
      alert('Tài khoản đã được tạo thành công!');
      onClose(); // Đóng form sau khi tạo thành công
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Đã xảy ra lỗi khi tạo tài khoản.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Tạo tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="TEACHER">Giảng viên</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
          <input
            type="text"
            name="profile.degree"
            placeholder="Học vị"
            value={formData.profile.degree}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="profile.department"
            placeholder="Phòng ban"
            value={formData.profile.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Tạo tài khoản
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2"
          >
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
}