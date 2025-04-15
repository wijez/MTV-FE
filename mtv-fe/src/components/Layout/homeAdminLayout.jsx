import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { fetchScientificResearch } from '../../api/api';

const HomeAdminLayout = ({ children }) => {
  const [data, setData] = useState([
    { name: 'Nghiên cứu đang mở', value: 0 },
    { name: 'Nghiên cứu đã hoàn thành', value: 0 },
  ]);

  const COLORS = ['#FF8042', '#0088FE']; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchScientificResearch();
        const researchList = response.data;

        if (researchList.length === 0) {
          console.warn('Không có dữ liệu nghiên cứu.');
          setData([
            { name: 'Nghiên cứu đang mở', value: 0 },
            { name: 'Nghiên cứu đã hoàn thành', value: 0 },
          ]);
          return;
        }
        const openCount = researchList.filter((item) => item.status === 'OPEN').length;
        const passedCount = researchList.filter((item) => item.status === 'COMPLETE').length;

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
    <div className="flex h-screen overflow-hidden">
      {/* Nội dung chính */}
      <div className="pt-10 flex-1 bg-gray-200 px-10 overflow-y-auto ">
        <div className="bg-white p-6 shadow rounded-2xl">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Thống kê các nghiên cứu</h1>
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