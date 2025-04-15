import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchScientificResearchDetails, updateScientificResearchStatus } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';
import AccessFunding from '../Form/AccessFunding';


export default function ScientificAdminDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [research, setResearch] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Gọi API để lấy chi tiết nghiên cứu
  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        const data = await fetchScientificResearchDetails(id); // Gọi API
        setResearch(data); // Lưu dữ liệu vào state
        localStorage.setItem(`research_${id}`, JSON.stringify(data)); // Lưu vào localStorage
        setLoading(false);
      } catch (error) {
        const cachedData = localStorage.getItem(`research_${id}`);
        if (cachedData) {
          setResearch(JSON.parse(cachedData)); // Lấy dữ liệu từ localStorage nếu có
        } else {
          setError('Không thể tải dữ liệu và không có dữ liệu đã lưu.');
          toast.error('Không thể tải dữ liệu và không có dữ liệu đã lưu.');
        }
        setLoading(false);
      }
    };

    fetchResearchDetails();
  }, [id]);

  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = async (newStatus) => {
    try {
      const payload = {
        ...research, // Gửi toàn bộ dữ liệu hiện tại
        status: newStatus, // Cập nhật trạng thái mới
        sr_activities: research.sr_activities.id, // Chỉ gửi ID của `sr_activities`
      };

      await updateScientificResearchStatus(id, payload); // Gọi API cập nhật trạng thái
      const updatedResearch = { ...research, status: newStatus };
      localStorage.setItem(`research_${id}`, JSON.stringify(updatedResearch)); // Cập nhật localStorage
      setResearch(updatedResearch); // Cập nhật state
      toast.success(`Trạng thái đã được cập nhật thành ${newStatus}`);
      navigate('/scientific-requests'); // Điều hướng về danh sách yêu cầu
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

  return (
    <>
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
              </div>
              <div>
                <p className="text-lg text-gray-700">
                  <strong>Số lượng thành viên:</strong> {research.number_member}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Cấp độ:</strong> {research.level}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Số lượng:</strong> {research.quantity}
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Thời gian:</strong> {research.time_volume}
                </p>
              </div>
            </div>
            
            {/* Nút Duyệt và Không Duyệt */}
            <div className="mt-8 flex justify-end space-x-4">
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition w-32" // Đặt chiều rộng cố định
              onClick={() => handleStatusChange('COMPLETE')}
            >
              Duyệt
            </button>
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition w-32" // Đặt chiều rộng cố định
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