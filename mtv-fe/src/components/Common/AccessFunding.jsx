import React, { useState, useEffect } from 'react';
import { updateSponsorshipProposalStatus, fetchSponsorshipProposalDetails } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';

export default function AccessFunding({ proposalId, currentStatus, onClose, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [proposalDetails, setProposalDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchSponsorshipProposalDetails(proposalId);
        setProposalDetails(data);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết đề xuất:', error);
        toast.error('Không thể tải chi tiết đề xuất.');
      }
    };

    fetchDetails();
  }, [proposalId]);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const updatedProposal = {
        ...proposalDetails,
        status: newStatus,
      };

      await updateSponsorshipProposalStatus(proposalId, updatedProposal);
      setStatus(newStatus);
      toast.success(`Trạng thái đã được cập nhật thành ${newStatus}`);
      onStatusChange(); // Gọi callback để reload danh sách
      onClose(); // Đóng dialog
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!proposalDetails) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <p className="text-gray-700 text-center">Đang tải chi tiết...</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Chi tiết đề xuất tài trợ</h2>
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">
            <strong>Nội dung:</strong> {proposalDetails.context || 'Không có nội dung'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Số tiền:</strong> {proposalDetails.funding || 'Không có thông tin'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Trạng thái:</strong> {status}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Ngày tạo:</strong>{' '}
            {new Date(proposalDetails.created_at).toLocaleDateString('vi-VN')}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Mã nghiên cứu:</strong> {proposalDetails.s_research || 'Không có mã nghiên cứu'}
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={() => handleStatusChange('PASSED')}
            disabled={loading}
          >
            Duyệt
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => handleStatusChange('NOT_PASSED')}
            disabled={loading}
          >
            Từ chối
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
