import React, { useEffect, useState } from 'react';
import Menu from '../menu';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import axios from 'axios';

const HomeAdminLayout = ({ children }) => {
  const [data, setData] = useState([
    { name: 'Nghiên cứu đang mở', value: 0 },
    { name: 'Nghiên cứu đã hoàn thành', value: 0 },
  ]);

  const COLORS = ['#FF8042', '#0088FE']; // Màu sắc cho biểu đồ

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/scientific_research/');
        const researchList = response.data;

        // Đếm số lượng nghiên cứu theo trạng thái
        const openCount = researchList.filter((item) => item.status === 'OPEN').length;
        const passedCount = researchList.filter((item) => item.status === 'PASSED').length;

        // Cập nhật dữ liệu biểu đồ
        setData([
          { name: 'Nghiên cứu đang mở', value: openCount },
          { name: 'Nghiên cứu đã hoàn thành', value: passedCount },
        ]);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <Menu />

      {/* Nội dung chính */}
      <div className="flex-1 bg-gray-100 p-6">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Thống kê NCKH</h1>
          <div className="flex justify-center items-center">
            <PieChart width={400} height={300}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Nội dung khác */}
        {children}
      </div>
    </div>
  );
};

export default HomeAdminLayout;