import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HeaderPage from '../header';

export default function ScientificDetails() {
  const { id } = useParams();
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
    <>
    <HeaderPage/>

      <div className="pt-40 container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">{research.name}</h1>
    <p><strong>Trạng thái:</strong> {research.status}</p>
    <p><strong>Mô tả:</strong> {research.description}</p>
    <p><strong>Thời gian tạo:</strong> {new Date(research.created_at).toLocaleDateString('vi-VN')}</p>
    <p><strong>Số lượng thành viên:</strong> {research.number_member}</p>

    <div className="mt-6">
  <h2 className="text-xl font-semibold mb-4">Tệp đính kèm</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {Array.isArray(research.banner) && research.banner.map((url, index) => (
      <div key={index} className="border border-gray-300 rounded p-2">
        {url.match(/\.(jpeg|jpg|gif|png)$/) ? (
          // Hiển thị ảnh
          <img
            src={url}
            alt={`Banner ${index + 1}`}
            className="w-full h-auto max-h-64 object-contain"
          />
        ) : url.match(/\.(mp4|webm|ogg|mkv)$/) ? (
          // Hiển thị video
          <video
            src={url}
            controls
            className="w-full h-auto max-h-64 object-contain"
          />
        ) : url.match(/\.(pdf)$/) ? (
          // Hiển thị PDF từ Cloudinary
          <iframe
            src={url}
            title={`PDF file ${index + 1}`}
            className="w-full h-64 border border-gray-300 rounded"
          ></iframe>
        ) : url.match(/\.(doc|docx|xls|xlsx|txt)$/) ? (
          // Hiển thị file Word, Excel, hoặc văn bản
          <iframe
            src={`https://docs.google.com/gview?url=${url}&embedded=true`}
            title={`File ${index + 1}`}
            className="w-full h-64 border border-gray-300 rounded"
          ></iframe>
        ) : (
          // Hiển thị file khác
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
        {/* Nút tải xuống */}
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
    </>
    
  );
}