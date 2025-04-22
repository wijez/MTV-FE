import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import { fetchScientificResearch } from '../../api/api';
import UndefineImage from '../../assets/undefine.png';
const minioHost = import.meta.env.VITE_MINIO_HOST;

export default function ScientificAdminLayout() {
  const [researchRequests, setResearchRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    Number(sessionStorage.getItem('scientificAdminPage')) || 1
  );
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API để lấy danh sách yêu cầu nghiên cứu
  useEffect(() => {
    const fetchResearchRequests = async () => {
      try {
        const response = await fetchScientificResearch();
        setResearchRequests(response.data);
        console.log('Danh sách yêu cầu nghiên cứu:', response.data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchResearchRequests();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('scientificAdminPage', currentPage);
  }, [currentPage]);


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
    <div className="flex max-h-screen">
       <div className="pt-0 flex-1 bg-gray-100 p-6 overflow-y-auto relative">
      <div className="bg-white p-6 rounded shadow min-h-[80vh]">
        <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">Xem Yêu Cầu Nghiên cứu</h1>

          {loading ? (
            <div className="text-center text-blue-500">Đang tải dữ liệu...</div>
          ) : (
            <div>
              {paginatedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center bg-gray-200 p-2 rounded mb-2"
                >
                  {/* Banner bên trái */}
                  <div className="flex-shrink-0">
                    <img
                      src={request.banner ? `${minioHost}/${request.banner}` : UndefineImage}
                      alt="Banner"
                      className="w-32 h-20 rounded"
                    />
                  </div>

                  {/* Thông tin bên phải */}
                  <div className="flex-1 ml-4">
                    <p className="font-bold">Tên: {request.name || 'Không có tên'}</p>
                    <p className="text-sm text-gray-600">Trạng thái: {request.status || 'Không có trạng thái'}</p>
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
              <div className="w-full flex justify-center absolute left-0 right-0 bottom-4">
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
