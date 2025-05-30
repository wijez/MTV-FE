import React, { useState } from 'react';
import { createUser } from '../../api/api';

export default function CreateAccount({ onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'TEACHER',
    is_active: false,
    profile: {
      degree: '',
      department: '',
      country: 'Quê quán',
      address: 'Địa chỉ', 
      nation: 'dân tộc', 
      nationality: 'Quốc tịch', 
      religion: 'tôn giáo', 
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

    // Kiểm tra các trường bắt buộc
    if (!formData.email || !formData.full_name) {
      alert('Vui lòng nhập đầy đủ Email và Họ và tên.');
      console.error('Thiếu trường bắt buộc: Email hoặc Họ và tên.');
      return;
    }

    try {
      const response = await createUser(formData);
      alert('Tài khoản đã được tạo thành công!');
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản:', error.response?.data || error.message);
      alert('Đã xảy ra lỗi khi tạo tài khoản.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          aria-label="Đóng"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Tạo tài khoản</h2>
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
          </select>
          <select
            name="profile.degree"
            value={formData.profile.degree}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Chọn học vị</option>
            <option value="TS">Tiến sĩ</option>
            <option value="THS">Thạc sĩ</option>
            <option value="PGS">Phó giáo sư</option>
            <option value="GS">Giáo sư</option>
          </select>
          <select
            name="profile.department"
            value={formData.profile.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Chọn phòng ban</option>
            <option value="HR">Nhân sự</option>
            <option value="IT">Công nghệ thông tin</option>
            <option value="LEGAL">Pháp chế</option>
            <option value="SALES">Kinh doanh</option>
          </select>
          <input
            type="text"
            name="profile.country"
            placeholder="Quê quán"
            value={formData.profile.country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="profile.address"
            placeholder="Địa chỉ"
            value={formData.profile.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="profile.nation"
            placeholder="Dân tộc"
            value={formData.profile.nation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="profile.nationality"
            placeholder="Quốc tịch"
            value={formData.profile.nationality}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="profile.religion"
            placeholder="Tôn giáo"
            value={formData.profile.religion}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Tạo tài khoản
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}