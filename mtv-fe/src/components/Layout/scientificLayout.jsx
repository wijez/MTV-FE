import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScientificForm from '../Form/scientificForm';
import { fetchUserScientificResearch,  fetchScientificResearchDetails } from '../../api/api'; // Import API từ api.jsx
import { Undo2 } from 'lucide-react';
import Pagination from '@mui/material/Pagination';

export default function ScientificLayout() {
  const [showForm, setShowForm] = useState(false);
  const [researchList, setResearchList] = useState([]); // Khởi tạo với mảng rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`scientific-details/${id}`);
  };

  const fetchResearchList = async () => {
    try {
      const userId = localStorage.getItem('userId'); 
      const userSRList = await fetchUserScientificResearch(userId);
      const researchIds = userSRList.map(item => item.scientific_research);
  
      // Lấy chi tiết từng nghiên cứu khoa học
      const researchDetails = await Promise.all(
        researchIds.map(id => fetchScientificResearchDetails(id))
      );
  
      setResearchList(researchDetails);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nghiên cứu:', error);
      setError('Không thể tải danh sách nghiên cứu.');
      setResearchList([]);
      setLoading(false);
    }
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submit', formData);
    setShowForm(false); // Ẩn form sau khi submit
    fetchResearchList(); 
  };

  useEffect(() => {
    fetchResearchList();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedResearchList = Array.isArray(researchList)
    ? researchList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : []; // Đảm bảo `slice` chỉ được gọi trên mảng

  return (
    <div className="container mx-auto p-4">
      {showForm && (
        <ScientificForm
          onSubmit={handleFormSubmit} // Xử lý khi form được submit
          onClose={() => setShowForm(false)} // Đóng form
        />
      )}

      <div className="pt-30 flex justify-between items-center">
        {/* Nút quay lại và tạo nghiên cứu */}
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          <Undo2 className="w-4 h-4 mr-1" />
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mt-1"
          onClick={() => setShowForm(true)}
        >
          Tạo Nghiên Cứu mới
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="mt-2 overflow-y-auto max-h-[calc(100vh-150px)]">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100 sticky -top-0.5 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Tên NCKH</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Thời gian</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {paginatedResearchList.map((research, index) => (
              <tr key={research.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-6 py-2">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">{research.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      research.status === 'COMPLETE'
                        ? 'bg-green-500'
                        : research.status === 'UN_COMPLETE'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    {research.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(research.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="bg-black text-white px-4 py-0 rounded hover:bg-gray-800"
                    onClick={() => handleViewDetails(research.id)}
                  >
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination cố định */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4">
        <div className="flex justify-center">
          <Pagination
            count={Math.ceil(researchList.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      </div>
    </div>
  );
}