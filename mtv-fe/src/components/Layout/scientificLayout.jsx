import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ScientificForm from '../Form/scientificForm'
import axios from 'axios';
import { Undo2 } from 'lucide-react';
import Pagination from '@mui/material/Pagination';


export default function ScientificLayout() {
  const [showForm, setShowForm] = useState(false);
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 


  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`scientific-details/${id}`);
  };

  // lấy danh sách nghiên cứu từ API
  const fetchResearchList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/scientific_research/')
      setResearchList(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleFormSubmit = (formData) => {
    console.log('Form submit', formData);
    setShowForm(false); // Ẩn form sau khi submit
    fetchResearchList(); // Lấy danh sách nghiên cứu mới
  };


  useEffect(() => {
    fetchResearchList();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); 
  };
  const paginatedResearchList = researchList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="container mx-auto p-4">
      <div className="pt-30 flex justify-between items-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          onClick={() => navigate(-1)} 
        >
          <Undo2 className="w-4 h-4 mr-1" />
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mt-1"
          onClick={() => setShowForm(true)} // Hiển thị form khi nhấn nút
        >
          Tạo Nghiên Cứu mới
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>
            <ScientificForm onSubmit={handleFormSubmit} onClose={() => setShowForm(false)} /> {/* Truyền hàm handleFormSubmit */}
          </div>
        </div>
      )}

      {/* Hiển thị trạng thái tải */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-yellow-500 text-6xl mb-4">⏳</div>
          <p className="text-gray-500 text-lg text-center">Đang tải danh sách nghiên cứu...</p>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500 text-lg text-center">{error}</p>
        </div>
      )}

   {/* Hiển thị danh sách nghiên cứu */}
{!loading && !error && researchList.length > 0 && (
  <div className="mt-8">
    <div className="overflow-y-auto max-h-[60vh]">
      <table className="table-auto w-full border-collapse">
        <thead className='bg-gray-100 sticky -top-0.5 z-10'>
          <tr className="bg-gray-100">
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
      <td className="border border-gray-300 px-4 py-2">
        {(currentPage - 1) * itemsPerPage + index + 1}
      </td>
      <td className="border border-gray-300 px-4 py-2">{research.name}</td>
      <td className="border border-gray-300 px-4 py-2">
        <span
          className={`px-2 py-1 rounded text-white ${
            research.status === 'IN PROGRESS'
              ? 'bg-purple-500'
              : research.status === 'ACCEPT'
              ? 'bg-green-500'
              : 'bg-red-500'
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
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
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
    <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(researchList.length / itemsPerPage)} // Tổng số trang
              page={currentPage} // Trang hiện tại
              onChange={handlePageChange} // Hàm xử lý khi thay đổi trang
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
)}

      {/* Hiển thị khi không có nghiên cứu */}
      {!loading && !error && researchList.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-yellow-500 text-6xl mb-4">🕒</div>
          <p className="text-gray-500 text-lg text-center">Không có nghiên cứu nào được tạo.</p>
        </div>
      )}
      </div>
  );
}