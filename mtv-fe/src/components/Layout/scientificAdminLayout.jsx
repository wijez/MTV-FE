import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { fetchScientificResearch } from '../../api/api';
import UndefineImage from '../../assets/undefine.png';

export default function ScientificAdminLayout() {
  const [researchRequests, setResearchRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API để lấy danh sách yêu cầu nghiên cứu
  useEffect(() => {
    const fetchResearchRequests = async () => {
      try {
        const response = await fetchScientificResearch();
        setResearchRequests(response.data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
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
    navigate(`/scientific-details/${id}`);
  };

  return (
    <div className="flex h-screen">
      <div className="pt-20 flex-1 bg-gray-100 p-6">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">Xem Yêu Cầu Nghiên cứu</h1>

          {loading ? (
            <div className="text-center text-blue-500">Đang tải dữ liệu...</div>
          ) : (
            <div>
              {paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center bg-gray-200 p-4 rounded mb-4"
                >
                  {/* Banner bên trái */}
                  <div className="flex-shrink-0">
                    <img
                      src={request.banner || UndefineImage}
                      alt="Banner"
                      className="w-32 h-20 rounded"
                    />
                  </div>

                  {/* Thông tin bên phải */}
                  <div className="flex-1 ml-4">
                    <p className="font-bold">Tên: {request.name || 'Không có tên'}</p>
                    <p className="text-sm text-gray-600">Trạng thái: {request.status || 'Không có trạng thái'}</p>
                    <p className="text-sm text-gray-600">Cấp độ: {request.level || 'Không có cấp độ'}</p>
                    <p className="text-sm text-gray-600">
                      Ngày tạo: {new Date(request.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  {/* Nút Xem */}
                  <div>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      Xem
                    </button>
                  </div>
                </div>
              ))}

              {/* Phân trang */}
              <div className="flex justify-center mt-4">
                <Pagination
                  count={Math.ceil(researchRequests.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
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
