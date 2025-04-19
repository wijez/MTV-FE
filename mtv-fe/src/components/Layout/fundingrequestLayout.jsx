import React, { useEffect, useState } from 'react';
import { fetchSponsorshipProposals, fetchScientificResearchDetails } from '../../api/api';
import AccessFunding from '../Common/AccessFunding';
import ReusablePagination from '../Common/ReusablePagination';

export default function FundingRequestLayout() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getProposals = async () => {
    try {
      const data = await fetchSponsorshipProposals();

      // Lấy thông tin chi tiết nghiên cứu cho từng `s_research`
      const proposalsWithResearchNames = await Promise.all(
        data.map(async (proposal) => {
          if (proposal.s_research) {
            try {
              const researchDetails = await fetchScientificResearchDetails(proposal.s_research);
              return { ...proposal, researchName: researchDetails.name };
            } catch {
              return { ...proposal, researchName: 'Không tìm thấy tên nghiên cứu' };
            }
          }
          return { ...proposal, researchName: 'Không có mã nghiên cứu' };
        })
      );

      setProposals(proposalsWithResearchNames);
    } catch (err) {
      setError('Lỗi khi tải danh sách đề xuất tài trợ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProposals();
  }, []); // Chỉ gọi khi component được mount

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Cập nhật trang hiện tại
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProposals = proposals.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <div>Đang tải danh sách...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách đề xuất tài trợ</h1>
      {currentProposals.length === 0 ? (
        <div>Không có đề xuất tài trợ nào.</div>
      ) : (
        <ul className="space-y-4">
          {currentProposals.map((proposal) => (
            <li
              key={proposal.id}
              className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
              onClick={() => setSelectedProposal(proposal)} // Hiển thị dialog khi nhấn vào từng mục
            >
              <h2 className="text-lg font-semibold">Đề xuất : {proposal.context || 'Không có nội dung'}</h2>
              <p className="text-sm text-gray-600">
                <strong>Số tiền:</strong> {proposal.funding || 'Không có thông tin'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Trạng thái:</strong> {proposal.status || 'Không có trạng thái'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Ngày tạo:</strong>{' '}
                {new Date(proposal.created_at).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tên nghiên cứu:</strong> {proposal.researchName || 'Không có mã nghiên cứu'}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ReusablePagination
        totalItems={proposals.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {selectedProposal && (
        <AccessFunding
          proposalId={selectedProposal.id} // ID của đề xuất tài trợ
          currentStatus={selectedProposal.status} // Trạng thái hiện tại
          onClose={() => setSelectedProposal(null)} // Đóng dialog
          onStatusChange={() => getProposals()} // Reload danh sách khi có thay đổi
        />
      )}
    </div>
  );
}
