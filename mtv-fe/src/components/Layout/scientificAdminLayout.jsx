import React, { useState, useEffect } from 'react';
import Menu from '../menu';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ScientificAdminLayout() {
  const [researchRequests, setResearchRequests] = useState([]); // Danh sách yêu cầu nghiên cứu
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số lượng yêu cầu trên mỗi trang
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook để điều hướng

  // Gọi API để lấy danh sách yêu cầu nghiên cứu
  useEffect(() => {
    const fetchResearchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/scientific_research/');
        setResearchRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setLoading(false);
      }
    };

    fetchResearchRequests();
  }, []);

  // Xử lý khi thay đổi trang
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Tính toán danh sách hiển thị cho trang hiện tại
  const paginatedRequests = researchRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm xử lý khi nhấn nút "Xem"
  const handleViewDetails = (id) => {
    navigate(`/scientific-details/${id}`); // Điều hướng đến trang chi tiết
  };

  return (
    <div className="flex h-screen">
      <Menu />

      <div className="pt-20 flex-1 bg-gray-100 p-6">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">Xem Yêu Cầu NCKH</h1>

          {loading ? (
            <div className="text-center text-blue-500">Đang tải dữ liệu...</div>
          ) : (
            <div>
              {paginatedRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center bg-gray-200 p-4 rounded mb-4"
                >
                  <div>
                    <p className="font-bold">{request.name}</p>
                    <p className="text-sm text-gray-600">GV: {request.status}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleViewDetails(request.id)} // Gọi hàm điều hướng
                  >
                    Xem
                  </button>
                </div>
              ))}

              {/* Phân trang */}
              <div className="flex justify-center mt-4">
                <Pagination
                  count={Math.ceil(researchRequests.length / itemsPerPage)} // Tổng số trang
                  page={currentPage} // Trang hiện tại
                  onChange={handlePageChange} // Hàm xử lý khi thay đổi trang
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
