import React from 'react'

const sampleData = [
    { id: 1, tt_hk: 'Nghiên cứu A', status: 'Hoàn thành', created_at: '2023-01-15' },
    { id: 2, tt_hk: 'Nghiên cứu B', status: 'Đang thực hiện', created_at: '2023-02-20' },
    { id: 3, tt_hk: 'Nghiên cứu C', status: 'Chưa bắt đầu', created_at: '2023-03-10' },
    { id: 4, tt_hk: 'Nghiên cứu D', status: 'Hoàn thành', created_at: '2023-04-05' },
  ];

export default function ScientificResearch() {
    return (
        <div className="bg-white w-full h-full rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-4">Các nghiên cứu khoa học đã tạo</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Tên nghiên cứu</th>
                  <th className="py-2 px-4 border-b">Trạng thái</th>
                  <th className="py-2 px-4 border-b">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b">{item.id}</td>
                    <td className="py-2 px-4 border-b">{item.tt_hk}</td>
                    <td className="py-2 px-4 border-b">{item.status}</td>
                    <td className="py-2 px-4 border-b">{item.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    )
}
