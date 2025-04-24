import React from 'react';
import { useUserResearch } from '../../hook/Hook'; // Import hook tái sử dụng

export default function ScientificResearch({ userId }) {
  const { researchList, loading } = useUserResearch(userId); // Sử dụng hook tái sử dụng

  return (
    <div className="bg-white w-full h-full rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-4">Các nghiên cứu khoa học</h3>
      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        {loading ? (
          <div className="text-center text-blue-500">Đang tải...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Tên nghiên cứu</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Ngày tạo</th>
                <th className="py-2 px-4 border-b">Điểm</th>
              </tr>
            </thead>
            <tbody>
              {researchList.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.status}</td>
                  <td className="py-2 px-4 border-b">{item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : ''}</td>
                  <td className="py-2 px-4 border-b">{item.point ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
