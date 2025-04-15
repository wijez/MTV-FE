import React, { useEffect, useState } from 'react';
import { fetchSponsorshipProposals,  fetchScientificResearchDetails } from '../../api/api'; 
import AccessFunding from '../Form/AccessFunding';

export default function FundingRequestLayout() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
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

    getProposals();
  }, []);

  if (loading) {
    return <div>Đang tải danh sách...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách đề xuất tài trợ</h1>
      {proposals.length === 0 ? (
        <div>Không có đề xuất tài trợ nào.</div>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <li
              key={proposal.id}
              className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition"
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
                <strong>Tên nghiên cứu:</strong> {proposal.researchName|| 'Không có mã nghiên cứu'}
              </p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => setSelectedProposal(proposal)} // Hiển thị dialog
              >
                Thay đổi trạng thái
              </button>
            </li>
          ))}
        </ul>
      )}
        {selectedProposal && (
        <AccessFunding 
          proposalId={selectedProposal.id} // ID của đề xuất tài trợ
          currentStatus={selectedProposal.status} // Trạng thái hiện tại
          onClose={() => setSelectedProposal(null)} // Đóng dialog
        />
      )}
    </div>
  );
}
