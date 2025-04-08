import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderPage from '../header';
import Menu from '../menu';

export default function ScientificAdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/scientific_research/${id}`);
        setResearch(response.data);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải chi tiết nghiên cứu.');
        setLoading(false);
      }
    };

    fetchResearchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:8000/scientific_research/${id}`, {
        name: research.name,
        number_member: research.number_member,
        description: research.description,
        status: newStatus,
        level: research.level,
        quantity: research.quantity,
        time_volume: research.time_volume,
        banner: research.banner,
        sr_activities: research.sr_activities.id,
      });

      setResearch((prev) => ({ ...prev, status: newStatus }));
      alert(`Trạng thái đã được cập nhật thành ${newStatus}`);
      navigate('/scientific-requests');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);

      if (error.response) {
        alert(`Lỗi máy chủ: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        alert('Không thể kết nối đến máy chủ.');
      } else {
        alert(`Lỗi: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-yellow-500 text-6xl mb-4">⏳</div>
        <p className="text-gray-500 text-lg text-center">Đang tải chi tiết nghiên cứu...</p>
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderPage />

      {/* Bố cục chính */}
      <div className="flex flex-1 pt-16">
        {/* Menu */}
          <Menu />
    

        {/* Nội dung chính */}
        <div className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto">
          <div className="bg-white p-4 sm:p-6 rounded shadow">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">{research.name}</h1>
            <p className="text-sm sm:text-base"><strong>Trạng thái:</strong> {research.status}</p>
            <p className="text-sm sm:text-base"><strong>Mô tả:</strong> {research.description}</p>
            <p className="text-sm sm:text-base"><strong>Thời gian tạo:</strong> {new Date(research.created_at).toLocaleDateString('vi-VN')}</p>
            <p className="text-sm sm:text-base"><strong>Số lượng thành viên:</strong> {research.number_member}</p>

            {/* Nút Duyệt và Không Duyệt */}
            <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => handleStatusChange('COMPLETE')}
              >
                Duyệt
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => handleStatusChange('NOT_COMPLETED')}
              >
                Không Duyệt
              </button>
            </div>

            {/* Tệp đính kèm */}
            <div className="mt-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Tệp đính kèm</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(research.banner) && research.banner.map((url, index) => (
                  <div key={index} className="border border-gray-300 rounded p-2">
                    {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={url}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    ) : url.match(/\.(mp4|webm|ogg|mkv)$/) ? (
                      <video
                        src={url}
                        controls
                        className="w-full h-auto max-h-64 object-contain"
                      />
                    ) : url.match(/\.(pdf)$/) ? (
                      <iframe
                        src={url}
                        title={`PDF file ${index + 1}`}
                        className="w-full h-64 border border-gray-300 rounded"
                      ></iframe>
                    ) : url.match(/\.(doc|docx|xls|xlsx|txt)$/) ? (
                      <iframe
                        src={`https://docs.google.com/gview?url=${url}&embedded=true`}
                        title={`File ${index + 1}`}
                        className="w-full h-64 border border-gray-300 rounded"
                      ></iframe>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="text-gray-700 text-sm mb-2">Không thể xem trước tệp này:</p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Xem tệp {index + 1}
                        </a>
                      </div>
                    )}
                    <div className="mt-2 text-center">
                      <a
                        href={url}
                        download
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Tải xuống
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}