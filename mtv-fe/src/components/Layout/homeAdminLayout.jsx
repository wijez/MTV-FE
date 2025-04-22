import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { fetchScientificResearch, fetchUsers, fetchSponsorshipProposals  } from '../../api/api';
import { Binoculars, Coins, CircleUserRound } from 'lucide-react';
const HomeAdminLayout = ({ children }) => {
  const [data, setData] = useState([
    { name: 'Nghiên cứu đang mở', value: 0 },
    { name: 'Nghiên cứu đã hoàn thành', value: 0 },
    { name: 'Nghiên cứu đang thực hiện', value: 0 },
  ]);
  const [totalResearch, setTotalResearch] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);

  const COLORS = ['#FF8042', '#0088FE', '#00C49F'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy nghiên cứu
        const researchRes = await fetchScientificResearch();
        const researchList = researchRes.data;
        setTotalResearch(researchList.length);

        if (researchList.length === 0) {
          setData([
            { name: 'Nghiên cứu đang mở', value: 0 },
            { name: 'Nghiên cứu đã hoàn thành', value: 0 },
            { name: 'Nghiên cứu đang thực hiện', value: 0 },
          ]);
        } else {
          const openCount = researchList.filter((item) => item.status === 'OPEN').length;
          const passedCount = researchList.filter((item) => item.status === 'COMPLETE').length;
          const processCount = researchList.filter((item) => item.status === 'PROCESS').length;
          setData([
            { name: 'Nghiên cứu đang mở', value: openCount },
            { name: 'Nghiên cứu đã hoàn thành', value: passedCount },
            { name: 'Nghiên cứu đang thực hiện', value: processCount },
          ]);
        }

        // Lấy user
        const usersRes = await fetchUsers();
        setTotalUsers(usersRes.length);

        // Lấy yêu cầu kinh phí
        const fundingRes = await fetchSponsorshipProposals();
        setTotalFunding(fundingRes.length);

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
          <div className="flex justify-around mt-8 gap-6">
          <div className="bg-blue-50 rounded-xl shadow p-6 flex-1 flex flex-col items-center">
            <span className="text-gray-600 mb-2">Nghiên cứu</span>
            <Binoculars className=' text-blue-600' />
            <span className="text-3xl font-bold text-blue-600">{totalResearch}</span>
          </div>
          <div className="bg-green-50 rounded-xl shadow p-6 flex-1 flex flex-col items-center">
            <span className="text-gray-600 mb-2">Người dùng</span>
            <CircleUserRound className='text-gray-600' />
            <span className="text-3xl font-bold text-green-600">{totalUsers}</span>
          </div>
          <div className="bg-pink-50 rounded-xl shadow p-6 flex-1 flex flex-col items-center">
            <span className="text-gray-600 mb-2">Kinh phí đề xuất</span>
            <Coins className='text-pink-600' />
            <span className="text-3xl font-bold text-pink-600">{totalFunding}</span>
          </div>
        </div>
        </div>

        {/* Nội dung khác */}
        {children}
      </div>
    </div>
  );
};

export default HomeAdminLayout;