import React, { useState, useEffect } from 'react';
import { fetchSponsorshipProposals } from '../../api/api';
import FundingForm from '../Form/fundingForm';

export default function FundingLayout() {
  const [proposals, setProposals] = useState([]); // Danh sách đề xuất tài trợ
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [filterTime, setFilterTime] = useState('all'); // Bộ lọc thời gian
  const [showFormModal, setShowFormModal] = useState(false); // Hiển thị form tạo đề xuất

  // Lấy danh sách đề xuất tài trợ từ API
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await fetchSponsorshipProposals(); // Gọi API
        let filteredData = data;

        // Áp dụng bộ lọc thời gian
        if (filterTime !== 'all') {
          const now = new Date();
          filteredData = data.filter((proposal) => {
            const proposalDate = new Date(proposal.created_at);
            if (filterTime === 'last_week') {
              return (now - proposalDate) / (1000 * 60 * 60 * 24) <= 7;
            } else if (filterTime === 'last_month') {
              return (now - proposalDate) / (1000 * 60 * 60 * 24) <= 30;
            }
            return true;
          });
        }

        setProposals(filteredData); // Lưu danh sách đề xuất đã lọc
      } catch (err) {
        console.error('Lỗi khi tải danh sách đề xuất tài trợ:', err);
        setError('Không thể tải danh sách đề xuất tài trợ.');
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };

    fetchProposals();
  }, [filterTime]); // Gọi lại khi bộ lọc thời gian thay đổi

  if (loading) {
    return <div className="text-center py-10">Đang tải danh sách...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="pt-30 flex justify-between items-center mb-4">
        {/* Nút tạo đề xuất */}
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setShowFormModal(true)}
        >
          Tạo đề xuất
        </button>

        {/* Bộ lọc thời gian */}
        <select
          className="border p-2 rounded"
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="last_week">Tuần trước</option>
          <option value="last_month">Tháng trước</option>
        </select>
      </div>

      {/* Danh sách đề xuất */}
      <div className="overflow-x-auto">
        {proposals.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">STT</th>
                <th className="py-2 px-4 border-b">Nội dung</th>
                <th className="py-2 px-4 border-b">Tên</th>
                <th className="py-2 px-4 border-b">Kinh phí</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal, index) => (
                <tr key={proposal.id}>
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{proposal.context || 'Không có trạng thái'}</td>
                  <td className="py-2 px-4 border-b">{proposal.s_research || 'Không có tên NCKH'}</td>
                  <td className="py-2 px-4 border-b">{proposal.funding || 'Không có kinh phí'}</td>
                  <td className="py-2 px-4 border-b">{proposal.status || 'Không có trạng thái'}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(proposal.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-500">Không có đề xuất nào</p>
          </div>
        )}
      </div>

      {/* Form tạo đề xuất */}
      {showFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl mb-4">Tạo đề xuất mới</h2>
            <FundingForm
              formData={{ s_research: '', funding: '', context: '', status: 'OPEN' }}
              setFormData={() => {}}
              onSubmit={() => {}}
              setShowFormModal={setShowFormModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}