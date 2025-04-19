import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ResearchQuestions from '../Common/researchQuestions';
import { createScientificResearch, searchUsers } from '../../api/api';

export default function ScientificForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    number_member: 1,
    description: '',
    status: 'OPEN',
    quantity: '',
    time_volume: '',
    documents: '',
    data: {},
    sr_activities: '',
    list_user: [],
  });

  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  // Nhận dữ liệu từ ResearchQuestions
  const handleActivitySelect = (selectedData) => {
    setFormData((prev) => ({
      ...prev,
      data: selectedData,
      sr_activities: selectedData.activityId,
      time_volume: selectedData.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Tìm kiếm người dùng
  const handleUserSearch = async () => {
    try {
      const response = await searchUsers(userSearch);
      // Đảm bảo luôn là mảng, kể cả khi không có kết quả
      let users = [];
      if (Array.isArray(response)) {
        users = response;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      }
      setUserResults(users);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      toast.error('Không thể tìm kiếm người dùng.');
      setUserResults([]);
    }
  };

  // Thêm thành viên (có input nhập điểm)
  const handleAddUser = (user) => {
    if (!formData.list_user.some(u => u.id === user.id)) {
      setFormData((prev) => ({
        ...prev,
        list_user: [...prev.list_user, { id: user.id, point: 0 }],
        number_member: prev.list_user.length + 1,
      }));
      setUserDetails((prev) => ({
        ...prev,
        [user.id]: user.full_name,
      }));
    }
  };

  // Xóa thành viên
  const handleRemoveUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      list_user: prev.list_user.filter((u) => u.id !== userId),
      number_member: prev.list_user.filter((u) => u.id !== userId).length,
    }));
    setUserDetails((prev) => {
      const updatedDetails = { ...prev };
      delete updatedDetails[userId];
      return updatedDetails;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Đảm bảo các trường số là số, không phải chuỗi rỗng
    const submitData = {
      ...formData,
      number_member: Number(formData.number_member) || 0,
      quantity: Number(formData.quantity) || 0,
      time_volume: Number(formData.time_volume) || 0,
      list_user: (formData.list_user || []).map(u => ({
        id: u.id,
        point: Number(u.point) || 0
      }))
    };
    try {
      const response = await createScientificResearch(submitData);
      toast.success('Tạo nghiên cứu khoa học thành công!');
      onSubmit(response.data || response);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`Lỗi ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
      console.error('Error creating scientific research:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[90vh] relative"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Tạo Nghiên Cứu</h2>

        {/* Tên nghiên cứu */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Tên Nghiên Cứu
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Mô Tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Hoạt động NCKH */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Hoạt Động NCKH</label>
          <ResearchQuestions onSelect={handleActivitySelect} />
        </div>

        {/* Hiển thị time_volume nếu đã chọn từ ResearchQuestions */}
        {formData.time_volume && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Thời lượng (time_volume)</label>
            <input
              type="number"
              value={formData.time_volume}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
        )}

        {/* Tìm kiếm và thêm người dùng */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Thêm Thành Viên</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleUserSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tìm
            </button>
          </div>
          <ul className="mt-2">
            {(userResults || []).map((user) => (
              <li key={user.id} className="flex justify-between items-center p-2 border-b">
                <span>{user.full_name || user.email}</span>
                <button
                  type="button"
                  onClick={() => handleAddUser(user)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Thêm
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Danh sách thành viên */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Danh Sách Thành Viên</label>
          <ul>
            {(formData.list_user || []).map((userObj) => (
              <li key={userObj.id} className="flex justify-between items-center p-2 border-b">
                <span>{userDetails[userObj.id]}</span>
                <input
                  type="number"
                  min={0}
                  className="w-20 border rounded px-2 py-1 mx-2"
                  value={userObj.point}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      list_user: prev.list_user.map(u =>
                        u.id === userObj.id ? { ...u, point: val } : u
                      ),
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveUser(userObj.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
        >
          Tạo
        </button>
      </form>
    </div>
  );
}