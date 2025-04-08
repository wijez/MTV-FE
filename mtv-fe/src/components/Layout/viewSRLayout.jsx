import React, { useState, useEffect } from 'react';
import Menu from '../menu';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';

export default function ViewSRLayout() {
  const [researchRequests, setResearchRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [loading, setLoading] = useState(true);

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedRequests = researchRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen">
      {/* Menu */}
      <div className="w-64">
        <Menu />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
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
                    <p className="text-sm text-gray-600">GV: {request.teacher_name}</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Duyệt
                  </button>
                </div>
              ))}

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