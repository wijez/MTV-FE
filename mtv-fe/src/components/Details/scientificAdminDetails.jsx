import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchScientificResearchDetails, updateScientificResearchStatus } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import AccessFunding from '../Common/AccessFunding';

const minioHost = import.meta.env.VITE_MINIO_HOST;

export default function ScientificAdminDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [research, setResearch] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [modalPreview, setModalPreview] = useState(null); 

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        const data = await fetchScientificResearchDetails(id);
        setResearch(data);
        localStorage.setItem(`research_${id}`, JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        const cachedData = localStorage.getItem(`research_${id}`);
        if (cachedData) {
          setResearch(JSON.parse(cachedData)); 
        } else {
          setError('Không thể tải dữ liệu và không có dữ liệu đã lưu.');
          toast.error('Không thể tải dữ liệu và không có dữ liệu đã lưu.');
        }
        setLoading(false);
      }
    };

    fetchResearchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const payload = {
        ...research,
        status: newStatus,
        sr_activities: research.sr_activities.id,
      };

      await updateScientificResearchStatus(id, payload);
      const updatedResearch = { ...research, status: newStatus };
      localStorage.setItem(`research_${id}`, JSON.stringify(updatedResearch));
      setResearch(updatedResearch);
      toast.success(`Trạng thái đã được cập nhật thành ${newStatus}`);
      navigate('/scientific-requests');
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      if (error.response) {
        toast.error(`Lỗi máy chủ: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        toast.error('Không thể kết nối đến máy chủ.');
      } else {
        toast.error(`Lỗi: ${error.message}`);
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

  // Modal xem trước file
  const renderModal = () => (
    modalPreview && (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-100">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative overflow-auto max-h-[90vh]">
          <button
            className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-red-500"
            onClick={() => setModalPreview(null)}
          >
            ×
          </button>
          <div>
            <div className="font-bold mb-2">{modalPreview.name}</div>
            {modalPreview.type === 'image' && (
              <img src={modalPreview.url} alt={modalPreview.name} className="max-w-full max-h-[70vh] mx-auto" />
            )}
            {modalPreview.type === 'video' && (
              <video src={modalPreview.url} controls className="max-w-full max-h-[70vh] mx-auto" />
            )}
            {modalPreview.type === 'pdf' && (
              <iframe src={modalPreview.url} title={modalPreview.name} className="w-full h-[70vh] border" />
            )}
            {modalPreview.type === 'other' && (
              <span className="italic text-gray-500">Không thể xem trước nội dung</span>
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {renderModal()}
      <div className="flex-1 bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{research.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg text-gray-700">
                <strong>Trạng thái:</strong> {research.status}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Mô tả:</strong> {research.description}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Thời gian tạo:</strong>{' '}
                {new Date(research.created_at).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Cập nhật lần cuối:</strong>{' '}
                {new Date(research.updated_at).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-lg text-gray-700">
                <strong>ID:</strong> {research.id}
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-700">
                <strong>Số lượng thành viên:</strong> {research.number_member}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Số lượng:</strong> {research.quantity}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Thời gian:</strong> {research.time_volume}
              </p>
            </div>
          </div>

          {/* File nghiên cứu (data) */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Tài liệu nghiên cứu</h2>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(research.data) && research.data.length > 0 ? (
                research.data.map((url, idx) => {
                  let type = 'other';
                  if (url.match(/\.(jpeg|jpg|gif|png)$/)) type = 'image';
                  else if (url.match(/\.(mp4|webm|ogg|mkv)$/)) type = 'video';
                  else if (url.match(/\.(pdf)$/)) type = 'pdf';
                  return (
                    <div key={idx} className="border border-gray-300 rounded p-2 bg-white cursor-pointer"
                      onClick={() => setModalPreview({
                        type,
                        url: `${minioHost}/${url}`,
                        name: url.split('/').pop()
                      })}
                    >
                      {type === 'image' ? (
                        <img
                          src={`${minioHost}/${url}`}
                          alt={`File ${idx + 1}`}
                          className="w-32 h-20 rounded object-cover"
                        />
                      ) : type === 'video' ? (
                        <video
                          src={`${minioHost}/${url}`}
                          className="w-32 h-20 rounded object-cover"
                          muted
                        />
                      ) : type === 'pdf' ? (
                        <div className="flex flex-col items-center justify-center h-20 w-32 bg-gray-50 border border-gray-300 rounded">
                        <span className="text-blue-500 underline text-center">Xem PDF</span>
                        <iframe
                          src={`${minioHost}/${url}`}
                          title={`PDF file ${idx + 1}`}
                          className="hidden" // Ẩn iframe nhỏ, chỉ show khi click sẽ mở modal
                          tabIndex={-1}
                        />
                      </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-20">
                          <span className="text-gray-500">File</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Không có file nghiên cứu.</p>
              )}
            </div>
          </div>

          {/* Nút Duyệt và Không Duyệt */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-32"
              onClick={() => handleStatusChange('COMPLETE')}
            >
              Duyệt
            </button>
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition w-32"
              onClick={() => handleStatusChange('NOT_COMPLETED')}
            >
              Không Duyệt
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}